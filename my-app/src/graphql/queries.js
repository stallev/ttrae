/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHelpRequest = /* GraphQL */ `
  query GetHelpRequest($id: ID!) {
    getHelpRequest(id: $id) {
      id
      title
      address
      location {
        lat
        lon
        __typename
      }
      owner
      ownerUser {
        id
        name
        city
        country
        email
        emailNotifications
        createdAt
        updatedAt
        __typename
      }
      photos
      description
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listHelpRequests = /* GraphQL */ `
  query ListHelpRequests(
    $filter: ModelHelpRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHelpRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        address
        owner
        photos
        description
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const searchHelpRequests = /* GraphQL */ `
  query SearchHelpRequests(
    $filter: SearchableHelpRequestFilterInput
    $sort: [SearchableHelpRequestSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableHelpRequestAggregationInput]
  ) {
    searchHelpRequests(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        title
        address
        owner
        photos
        description
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
              __typename
            }
          }
        }
        __typename
      }
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      location {
        lat
        lon
        __typename
      }
      city
      country
      email
      emailNotifications
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        city
        country
        email
        emailNotifications
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const searchUsers = /* GraphQL */ `
  query SearchUsers(
    $filter: SearchableUserFilterInput
    $sort: [SearchableUserSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableUserAggregationInput]
  ) {
    searchUsers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        name
        city
        country
        email
        emailNotifications
        createdAt
        updatedAt
        __typename
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
              __typename
            }
          }
        }
        __typename
      }
      __typename
    }
  }
`;
