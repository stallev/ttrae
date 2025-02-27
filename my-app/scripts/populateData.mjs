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

// Predefined userIDs array
const usersIDs = [
  '9e001621-3907-4068-8538-1286cd3e7169',
  '95ff4fa8-acf8-4d56-b817-810a3c8d4210',
  '70fe8bc5-6caa-4360-8747-287617c94a39',
  '4ba07779-65cd-4bf7-89c1-1731429a5077',
  'ededade5-4001-456e-b0c3-b514f1e7a5ee',
  'c19c2965-7c3b-460e-8db2-99dbcdd84a78',
  'af93d961-2fe7-4b24-97a5-c31e1b371e7e',
  'ad1279f7-6dd0-4543-b955-d1231d052a16',
  '839ddb67-adb3-4fdb-ba14-cd26cced899d',
  '37111acc-4d3f-482b-aeec-b801f49dd0e8',
  'ec6cb56b-6dee-4368-ad5f-fa5e9cd44f8b',
  'f1515ccd-819a-4ef1-b371-88596e321921',
  'a7013060-a953-458a-8d2c-62f708b1897e',
  'e1e7d79c-c47c-488a-8d2c-62f708b1897e'
];

// City coordinates boundaries (approximate)
const cities = {
  Fresno: {
    lat: { min: 36.6915, max: 36.8228 },
    lon: { min: -119.9190, max: -119.7164 }
  },
  LosAngeles: {
    lat: { min: 33.7037, max: 34.3373 },
    lon: { min: -118.6682, max: -118.1553 }
  },
  Sacramento: {
    lat: { min: 38.4392, max: 38.6851 },
    lon: { min: -121.5489, max: -121.3653 }
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
      messagesNotification: faker.datatype.boolean()
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
  const ownerIDs = usersIDs.slice(0, 10); // First 10 IDs for help request owners
  
  try {
    for (let i = 0; i < 70; i++) {
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