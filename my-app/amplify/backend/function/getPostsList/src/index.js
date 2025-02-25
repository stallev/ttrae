const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

exports.handler = async (event) => {
  try {
    const domain =
      "https://search-amplify-opense-ko87vl00823d-egdcq5dtq6xkivmsd6tnakmq6q.us-east-1.es.amazonaws.com";

    const credentials = await defaultProvider()();
    console.log("credentials", credentials);

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

    const indexName = "post";

    // Get document count
    const countResponse = await client.count({
      index: indexName
    });
    console.log(`Total documents in ${indexName} index: ${countResponse.body.count}`);

    const response = await client.search({
      index: indexName,
      body: {
        query: {
          match_all: {}
        },
        _source: ["id", "title", "body", "category"],
        size: 100,
        sort: [{ "createdAt": "desc" }]
      },
    });

    console.log("--- List of all posts ---");

    if (response.body.hits && response.body.hits.hits) {
      const posts = response.body.hits.hits.map((hit) => hit._source);

      posts.forEach((post, index) => {
        console.log(`--- Post ${index + 1} ---`);
        console.log(`ID: ${post.id}`);
        console.log(`Title: ${post.title}`);
        console.log(`Content: ${post.body}`);
        console.log(
          `Category: ${post.category ? post.category.id : "Not specified"}`
        );
        console.log("----------------------");
      });

      console.log(`Total posts found: ${posts.length}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          posts: posts,
          message: "List of posts successfully retrieved"
        }),
      };
    } else {
      console.log("No posts found");
      return {
        statusCode: 200,
        body: JSON.stringify({
          posts: [],
          message: "No posts found"
        }),
      };
    }
  } catch (error) {
    console.error("Error retrieving posts:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error retrieving data from OpenSearch" }),
    };
  }
};
