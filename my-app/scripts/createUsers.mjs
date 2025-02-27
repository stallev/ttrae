import { Amplify } from '@aws-amplify/core';
import { generateClient } from '@aws-amplify/api';
import { faker } from '@faker-js/faker';
import awsconfig from '../src/aws-exports.js';
import { createUser } from '../src/graphql/mutations.js';

Amplify.configure({
  ...awsconfig,
  aws_appsync_graphqlEndpoint: 'https://kiivro4eirgtldybtflw7knd5m.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_apiKey: 'da2-g2tj7fk65rey3doo5vutjlgrkm',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'API_KEY'
});

const client = generateClient();

// Define city coordinates (approximate centers)
const CALIFORNIA_CITIES = [
  { name: 'Fresno', lat: 36.7378, lon: -119.7871 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'Sacramento', lat: 38.5816, lon: -121.4944 }
];

// Helper function to get random coordinates within ~10km of city center
function getRandomLocation(city) {
  const lat = city.lat + (Math.random() - 0.5) * 0.1; // ~5km north/south
  const lon = city.lon + (Math.random() - 0.5) * 0.1; // ~5km east/west
  return { lat, lon };
}

const usersCount = 40;

function generateUser(index) {
  const randomCity = CALIFORNIA_CITIES[Math.floor(Math.random() * CALIFORNIA_CITIES.length)];
  const location = getRandomLocation(randomCity);

  return {
    email: `user${index + 1}@example.com`,
    name: faker.person.fullName(),
    bio: faker.person.bio(),
    location: {
      lat: location.lat,
      lon: location.lon
    },
    city: randomCity.name,
    country: 'USA',
    profilePicture: {
      bucket: 'user-profile-pictures',
      region: 'us-east-1',
      key: `user${index + 1}-profile.jpg`
    },
    locale: 'en-US'
  };
}

async function createUsers() {
  try {
    for (let i = 0; i < usersCount; i++) {
      const userData = generateUser(i);
      const newUser = await client.graphql({
        query: createUser,
        variables: { input: userData }
      });
      console.log(`Created user ${i + 1}:`, newUser.data.createUser.id);
    }
    console.log(`Successfully created ${usersCount} users!`);
  } catch (error) {
    console.error('Error creating users:', error);
  }
}

createUsers();