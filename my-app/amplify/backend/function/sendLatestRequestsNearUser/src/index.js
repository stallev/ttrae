const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const helpRequestIndexName = "helprequest";
const userIndexName = "user";

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

      // Проверка наличия координат
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

    groups.push(currentGroup);
  }

  return groups;
}

exports.handler = async (event) => {
  try {
    const domain = "https://search-amplify-opense-14back7ydf2t8-yo5fr22z6zd2j3rze4ymmcwg74.us-east-1.es.amazonaws.com";

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

    // Запрос к OpenSearch с фильтрацией по полям и сортировкой по createdAt
    const response = await client.search({
      index: helpRequestIndexName,
      body: {
        query: {
          range: {
            createdAt: {
              gte: "now-30d/d", // Фильтр по последним 30 дням
              lte: "now/d"
            }
          }
        },
        _source: ["id", "title", "location", "createdAt"], // Получаем только необходимые поля
        size: 1000, // Ограничение на количество записей
        sort: [{ "createdAt": "desc" }] // Сортировка по дате создания
      },
    });

    if (response.body.hits && response.body.hits.hits) {
      const requests = response.body.hits.hits.map((hit) => hit._source);

      // Группировка запросов по координатам
      const groupedRequests = groupRequestsByLocation(requests, 40);
      console.log('groups count: ', groupedRequests.length);
      groupedRequests.map((group) => {
        console.log('requests count of the group', group.length);
      });
    //   console.log('Grouped Requests:', JSON.stringify(groupedRequests, null, 2));

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
          requestGroups: groupedRequests.length,
          message: "Help requests successfully retrieved and grouped"
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
          requestGroups: [],
          message: "No help requests found"
        }),
      };
    }
  } catch (error) {
    console.error("Error retrieving help requests:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ error: "Error retrieving data from OpenSearch" }),
    };
  }
};