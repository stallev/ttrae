import { Amplify } from '@aws-amplify/core';
import { generateClient } from '@aws-amplify/api';
import { faker } from '@faker-js/faker';
import awsconfig from '../src/aws-exports.js';
import { createUser, createHelpRequest } from '../src/graphql/mutations.js';

Amplify.configure({
  ...awsconfig,
  aws_appsync_graphqlEndpoint: 'https://kiivro4eirgtldybtflw7knd5m.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_apiKey: 'da2-g2tj7fk65rey3doo5vutjlgrkm',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'API_KEY'
});

const client = generateClient();

const usersIDs = [
  {
    id: '9e001621-3907-4068-8538-1286cd3e7169',
    email: 'user1@example.com'
  },
  {
    id: '95ff4fa8-acf8-4d56-b817-810a3c8d4210',
    email: 'user2@example.com'
  },
  {
    id: '70fe8bc5-6caa-4360-8747-287617c94a39',
    email: 'user3@example.com'
  },
  {
    id: '4ba07779-65cd-4bf7-89c1-1731429a5077',
    email: 'user4@example.com'
  },
  {
    id: 'ededade5-4001-456e-b0c3-b514f1e7a5ee',
    email: 'user5@example.com'
  },
  {
    id: 'c19c2965-7c3b-460e-8db2-99dbcdd84a78',
    email: 'user6@example.com'
  },
  {
    id: 'af93d961-2fe7-4b24-97a5-c31e1b371e7e',
    email: 'user7@example.com'
  },
  {
    id: 'ad1279f7-6dd0-4543-b955-d1231d052a16',
    email: 'user8@example.com'
  },
  {
    id: '839ddb67-adb3-4fdb-ba14-cd26cced899d',
    email: 'user9@example.com'
  },
  {
    id: '37111acc-4d3f-482b-aeec-b801f49dd0e8',
    email: 'user10@example.com'
  },
  {
    id: 'ec6cb56b-6dee-4368-ad5f-fa5e9cd44f8b',
    email: 'user11@example.com'
  }
];

const helpRequestsCount = 100000;
const firstHelpRequestsOwners = 28;

const cities = {
  Redding: {
    lat: { min: 40.5592, max: 40.6087 },
    lon: { min: -122.4077, max: -122.3147 }
  },
  Eureka: {
    lat: { min: 40.7827, max: 40.8087 },
    lon: { min: -124.1900, max: -124.1427 }
  },
  Chico: {
    lat: { min: 39.7100, max: 39.7684 },
    lon: { min: -121.8474, max: -121.7697 }
  },
  Napa: {
    lat: { min: 38.2871, max: 38.3197 },
    lon: { min: -122.3087, max: -122.2724 }
  },
  SanFrancisco: {
    lat: { min: 37.7079, max: 37.8199 },
    lon: { min: -122.5137, max: -122.3549 }
  },
  SanDiego: {
    lat: { min: 32.7157, max: 32.8807 },
    lon: { min: -117.2821, max: -117.1076 }
  },
  SanJose: {
    lat: { min: 37.2751, max: 37.4191 },
    lon: { min: -122.0811, max: -121.8086 }
  }
};

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomCity() {
  const cityNames = Object.keys(cities);
  return cityNames[Math.floor(Math.random() * cityNames.length)];
}

function getRandomLocation(city) {
  const bounds = cities[city];
  return {
    lat: getRandomFloat(bounds.lat.min, bounds.lat.max),
    lon: getRandomFloat(bounds.lon.min, bounds.lon.max)
  };
}

function generateUser(id) {
  const city = getRandomCity();
  const location = getRandomLocation(city);

  return {
    id,
    name: faker.person.fullName(),
    location,
    city,
    country: 'USA',
    emailNotifications: JSON.stringify({
      newsNotification: faker.datatype.boolean()
    })
  };
}

function generateHelpRequest(index, ownerID) {
  const city = getRandomCity();
  const location = getRandomLocation(city);
  
  return {
    title: `Help Request #${index + 1} in ${city}`,
    address: `${Math.floor(Math.random() * 1000)} Sample St, ${city}, CA`,
    location,
    owner: ownerID,
    createdAt: new Date().toISOString()
  };
}

async function populateUsers() {
  console.log('Starting to populate users...');
  try {
    for (const id of usersIDs) {
      const userData = generateUser(id);
      const newUser = await client.graphql({
        query: createUser,
        variables: { input: userData }
      });
      console.log(`Created user with ID: ${id}`, console.log('new user', JSON.stringify(newUser, null, 2)));
    }
    console.log('Successfully created all users!');
  } catch (error) {
    console.error('Error creating users:', error);
    throw error;
  }
}

async function populateHelpRequests() {
  console.log('Starting to populate help requests...');
  const ownerIDs = usersIDs.slice(0, firstHelpRequestsOwners); // First 15 IDs for help request owners
  
  try {
    for (let i = 0; i < helpRequestsCount; i++) {
      const ownerID = ownerIDs[Math.floor(Math.random() * ownerIDs.length)];
      const helpRequestData = generateHelpRequest(i, ownerID);
      await client.graphql({
        query: createHelpRequest,
        variables: { input: helpRequestData }
      });
      console.log(`Created help request ${i + 1}`);
    }
    console.log('Successfully created all help requests!');
  } catch (error) {
    console.error('Error creating help requests:', error);
    throw error;
  }
}

async function main() {
  try {
    await populateUsers();
    await populateHelpRequests();
    console.log('Data population completed successfully!');
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
}

main();