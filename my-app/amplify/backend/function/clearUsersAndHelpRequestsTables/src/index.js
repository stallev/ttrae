/* Amplify Params - DO NOT EDIT
	API_MYTESTAPP1_GRAPHQLAPIENDPOINTOUTPUT
	API_MYTESTAPP1_GRAPHQLAPIIDOUTPUT
	API_MYTESTAPP1_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { AppSyncClient, EvaluateCodeCommand } = require('@aws-sdk/client-appsync');
const gql = require('graphql-tag');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const listUsers = gql`
  query ListUsers {
    listUsers {
      items {
        id
      }
    }
  }
`;

const listHelpRequests = gql`
  query ListHelpRequests {
    listHelpRequests {
      items {
        id
      }
    }
  }
`;

const deleteUser = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
    }
  }
`;

const deleteHelpRequest = gql`
  mutation DeleteHelpRequest($input: DeleteHelpRequestInput!) {
    deleteHelpRequest(input: $input) {
      id
    }
  }
`;

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(process.env.API_MYTESTAPP1_GRAPHQLAPIENDPOINTOUTPUT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_MYTESTAPP1_GRAPHQLAPIKEYOUTPUT
    },
    body: JSON.stringify({
      query: query.loc.source.body,
      variables
    })
  });

  const json = await response.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const startTime = Date.now();
  let deletedHelpRequestsCount = 0;
  let deletedUsersCount = 0;
  
  try {
    console.log('Fetching all users...');
    const usersData = await graphqlRequest(listUsers);
    const users = usersData.listUsers.items;
    console.log(`Found ${users.length} users to delete`);
    
    console.log('Fetching all help requests...');
    const helpRequestsData = await graphqlRequest(listHelpRequests);
    const helpRequests = helpRequestsData.listHelpRequests.items;
    console.log(`Found ${helpRequests.length} help requests to delete`);
    
    console.log('Deleting help requests...');
    for (const helpRequest of helpRequests) {
      await graphqlRequest(deleteHelpRequest, {
        input: { id: helpRequest.id }
      });
      deletedHelpRequestsCount++;
    }
    
    console.log('Deleting users...');
    for (const user of users) {
      await graphqlRequest(deleteUser, {
        input: { id: user.id }
      });
      deletedUsersCount++;
    }

    const executionTime = Date.now() - startTime;
    console.log(`Execution completed in ${executionTime}ms`);
    console.log(`Successfully deleted ${deletedHelpRequestsCount} help requests and ${deletedUsersCount} users`);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: 'Successfully deleted all users and help requests',
        // executionTime: `${executionTime}ms`,
        // statistics: {
        //   deletedUsers: deletedUsersCount,
        //   deletedHelpRequests: deletedHelpRequestsCount
        // }
      })
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error('Error:', error);
    console.log(`Execution failed after ${executionTime}ms`);
    console.log(`Partially deleted: ${deletedHelpRequestsCount} help requests and ${deletedUsersCount} users`);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: 'Error deleting data',
        executionTime: `${executionTime}ms`,
        statistics: {
          deletedUsers: deletedUsersCount,
          deletedHelpRequests: deletedHelpRequestsCount
        },
        error: error.message
      })
    };
  }
};
