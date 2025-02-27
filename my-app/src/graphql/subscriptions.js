/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateHelpRequest = /* GraphQL */ `
  subscription OnCreateHelpRequest(
    $filter: ModelSubscriptionHelpRequestFilterInput
  ) {
    onCreateHelpRequest(filter: $filter) {
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
        emailNotifications
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateHelpRequest = /* GraphQL */ `
  subscription OnUpdateHelpRequest(
    $filter: ModelSubscriptionHelpRequestFilterInput
  ) {
    onUpdateHelpRequest(filter: $filter) {
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
        emailNotifications
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteHelpRequest = /* GraphQL */ `
  subscription OnDeleteHelpRequest(
    $filter: ModelSubscriptionHelpRequestFilterInput
  ) {
    onDeleteHelpRequest(filter: $filter) {
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
        emailNotifications
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      name
      location {
        lat
        lon
        __typename
      }
      city
      country
      emailNotifications
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      name
      location {
        lat
        lon
        __typename
      }
      city
      country
      emailNotifications
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      name
      location {
        lat
        lon
        __typename
      }
      city
      country
      emailNotifications
      createdAt
      updatedAt
      __typename
    }
  }
`;
