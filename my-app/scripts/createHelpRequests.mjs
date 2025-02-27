import { Amplify } from '@aws-amplify/core';
import { generateClient } from '@aws-amplify/api';
import awsconfig from '../src/aws-exports.js';
import { createHelpRequest } from '../src/graphql/mutations.js';

Amplify.configure({
  ...awsconfig,
  aws_appsync_graphqlEndpoint: 'https://kiivro4eirgtldybtflw7knd5m.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_apiKey: 'da2-g2tj7fk65rey3doo5vutjlgrkm',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'API_KEY'
});

const client = generateClient();

const docsCount = 70;

// First 10 users for help request owners
const ownerUsers = Array.from({ length: 10 }, (_, i) => `user${i + 1}@example.com`);

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

function generateHelpRequest(index) {
  const city = getRandomCity();
  const location = getRandomLocation(city);
  const today = new Date();
  
  return {
    title: `Help Request #${index + 1} in ${city}`,
    description: `This is a sample help request in ${city}. Someone needs assistance with various tasks.`,
    category: categories[Math.floor(Math.random() * categories.length)],
    dueDate: new Date(today.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    address: `${Math.floor(Math.random() * 1000)} Sample St, ${city}, CA`,
    location: location,
    photos: JSON.stringify({
      urls: [`https://example.com/sample-photo-${index + 1}.jpg`]
    }),
    owner: ownerUsers[Math.floor(Math.random() * ownerUsers.length)],
    createdAt: new Date().toISOString()
  };
}

async function createHelpRequests() {
  try {
    for (let i = 0; i < docsCount; i++) {
      const helpRequestData = generateHelpRequest(i);
      const newHelpRequest = await client.graphql({
        query: createHelpRequest,
        variables: { input: helpRequestData }
      });
      console.log(`Created help request ${i + 1}:`, newHelpRequest.data.createHelpRequest.id);
    }
    console.log('Successfully created 40 help requests!');
  } catch (error) {
    console.error('Error creating help requests:', error);
  }
}

createHelpRequests();