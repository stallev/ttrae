const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const helpRequestIndexName = "helprequest";
const userIndexName = "user";
const domain = "https://search-amplify-opense-14back7ydf2t8-yo5fr22z6zd2j3rze4ymmcwg74.us-east-1.es.amazonaws.com";

// Функция для расчета расстояния между двумя точками (формула гаверсинуса)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Функция для группировки запросов по географическим координатам
function calculateGroupCenter(requests) {
  const sumLat = requests.reduce((sum, req) => sum + req.location.lat, 0);
  const sumLon = requests.reduce((sum, req) => sum + req.location.lon, 0);
  return {
    lat: sumLat / requests.length,
    lon: sumLon / requests.length
  };
}

function calculateGroupRadius(requests, center) {
  return Math.max(...requests.map(req => 
    calculateDistance(center.lat, center.lon, req.location.lat, req.location.lon)
  ));
}

function doGroupsOverlap(group1, group2) {
  const distance = calculateDistance(
    group1.geoCenter.lat, group1.geoCenter.lon,
    group2.geoCenter.lat, group2.geoCenter.lon
  );
  const sumOfRadii = group1.radius + group2.radius;
  return distance < sumOfRadii;
}

function groupRequestsByLocation(requests, maxDistance) {
  const groups = [];
  const used = new Set();

  for (let i = 0; i < requests.length; i++) {
    if (used.has(i)) continue;

    const currentGroup = [requests[i]];
    used.add(i);

    for (let j = i + 1; j < requests.length; j++) {
      if (used.has(j)) continue;

      const request1 = requests[i];
      const request2 = requests[j];

      if (!request1.location || !request2.location) {
        console.warn("Missing location data for request:", request1.id || request2.id);
        continue;
      }

      const distance = calculateDistance(
        request1.location.lat,
        request1.location.lon,
        request2.location.lat,
        request2.location.lon
      );

      if (distance <= maxDistance) {
        currentGroup.push(request2);
        used.add(j);
      }
    }

    const geoCenter = calculateGroupCenter(currentGroup);
    const radius = calculateGroupRadius(currentGroup, geoCenter);

    // Check for overlaps with existing groups
    const newGroup = {
      geoCenter,
      radius,
      requestsList: currentGroup
    };

    let hasOverlap = false;
    for (const existingGroup of groups) {
      if (doGroupsOverlap(newGroup, existingGroup)) {
        console.log(`Overlap detected between groups with centers at ${JSON.stringify(newGroup.geoCenter)} and ${JSON.stringify(existingGroup.geoCenter)}`);
        hasOverlap = true;
        break;
      }
    }

    if (!hasOverlap) {
        groups.push(newGroup);
      } else {
        console.log(`Group with center at ${JSON.stringify(geoCenter)} skipped due to overlap`);
        // Удаляем запросы из множества used
        currentGroup.forEach(req => {
          const index = requests.indexOf(req);
          if (index !== -1) used.delete(index);
        });
      }
  }

  return groups;
}

async function getUsersInArea(client, groupCenter, radius) {
  try {
    const response = await client.search({
      index: userIndexName,
      body: {
        query: { match_all: {} },
        _source: ["id", "name", "location", "city", "country", "emailNotifications"],
        size: 1000
      },
    });

    if (!response.body.hits || !response.body.hits.hits) {
      console.log('No users found');
      return [];
    }

    const users = response.body.hits.hits.map(hit => hit._source);
    const usersInArea = users.filter(user => {
      if (!user.location) {
        // console.warn(`User ${user.id} has no location data`);
        return false;
      }

      if (!user.emailNotifications?.newsNotification) {
        // console.warn(`${user.name} doesn't want to receive emails`);
        return false;
      }
      
      const distance = calculateDistance(
        groupCenter.lat,
        groupCenter.lon,
        user.location.lat,
        user.location.lon
      );
      const isInArea = distance <= radius;
      if (isInArea) {
        // console.log(`User ${user.name} (${user.id}) is within ${distance.toFixed(2)} miles of group center`);
      }

      return isInArea;
    });

    return usersInArea;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

exports.handler = async (event) => {
  const startTime = Date.now();
  let totalRequests = 0;
  let totalUsers = 0;
  let totalGroups = 0;

  try {
    const client = new Client({
      ...AwsSigv4Signer({
        region: "us-east-1",
        service: "es",
        getCredentials: () => {
          const credentialsProvider = defaultProvider();
          return credentialsProvider();
        },
      }),
      node: domain,
    });

    const response = await client.search({
      index: helpRequestIndexName,
      body: {
        query: {
          range: {
            createdAt: {
              gte: "now-30d/d",
              lte: "now/d"
            }
          }
        },
        _source: ["id", "title", "location", "createdAt"],
        size: 10000,
        sort: [{ "createdAt": "desc" }]
      },
    });

    if (response.body.hits && response.body.hits.hits) {
      const requests = response.body.hits.hits.map((hit) => hit._source);
      totalRequests = requests.length;
      const groupedRequests = groupRequestsByLocation(requests, 40);
      totalGroups = groupedRequests.length;
      console.log('Total groups created:', groupedRequests.length);      

      // Add users to each group
      for (const group of groupedRequests) {
        const usersNear = await getUsersInArea(client, group.geoCenter, group.radius);
        group.usersNear = usersNear;
        totalUsers += usersNear.length;
        console.log(`Added ${usersNear.length} users to group with center at ${JSON.stringify(group.geoCenter)}`);
      }

      groupedRequests.forEach((group, index) => {
        console.log(`Group ${index + 1}:`);
        console.log(`- Center: ${JSON.stringify(group.geoCenter)}`);
        console.log(`- Radius: ${group.radius} miles`);
        console.log(`- Requests: ${group.requestsList.length}`);
        console.log(`- Count of the Users near and wanting to receive emails: ${group.usersNear.length}`);
      });

      // Log group statistics
      const totalGroupedRequests = groupedRequests.reduce((sum, group) => sum + group.requestsList.length, 0);
      const averageRequestsPerGroup = totalGroupedRequests / groupedRequests.length;
      console.log('Total requests in all groups:', totalGroupedRequests);
      console.log('Average requests per group:', averageRequestsPerGroup.toFixed(2));

      const executionTime = Date.now() - startTime;
      console.log(`Execution completed in ${executionTime}ms`);
      console.log(`Summary: Processed ${totalRequests} requests, created ${totalGroups} groups, found ${totalUsers} nearby users`);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
          requestGroups: groupedRequests.length,
          message: "Help requests successfully retrieved and grouped with nearby users",
          statistics: {
            executionTime: `${executionTime}ms`,
            totalRequests,
            totalGroups,
            totalUsers
          }
        }),
      };
    } else {
      const executionTime = Date.now() - startTime;
      console.log(`Execution completed in ${executionTime}ms with no requests found`);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
          requestGroups: [],
          message: "No help requests found",
          statistics: {
            executionTime: `${executionTime}ms`,
            totalRequests: 0,
            totalGroups: 0,
            totalUsers: 0
          }
        }),
      };
    }
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error("Error retrieving help requests:", error);
    console.log(`Execution failed after ${executionTime}ms`);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        error: "Error retrieving data from OpenSearch",
        statistics: {
          executionTime: `${executionTime}ms`,
          totalRequests,
          totalGroups,
          totalUsers
        }
      }),
    };
  }
};