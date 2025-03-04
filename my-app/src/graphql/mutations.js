/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createHelpRequest = /* GraphQL */ `
  mutation CreateHelpRequest(
    $input: CreateHelpRequestInput!
    $condition: ModelHelpRequestConditionInput
  ) {
    createHelpRequest(input: $input, condition: $condition) {
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
      category
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateHelpRequest = /* GraphQL */ `
  mutation UpdateHelpRequest(
    $input: UpdateHelpRequestInput!
    $condition: ModelHelpRequestConditionInput
  ) {
    updateHelpRequest(input: $input, condition: $condition) {
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
      category
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteHelpRequest = /* GraphQL */ `
  mutation DeleteHelpRequest(
    $input: DeleteHelpRequestInput!
    $condition: ModelHelpRequestConditionInput
  ) {
    deleteHelpRequest(input: $input, condition: $condition) {
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
      category
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
