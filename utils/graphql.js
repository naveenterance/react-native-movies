import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query {
    allUsers {
      id
      username
      movieId
      rating
      review
    }
  }
`;
export const ADD_USER = gql`
  mutation CreateUser(
    $username: String!
    $movieId: String!
    $rating: String!
    $review: String!
  ) {
    createUser(
      username: $username
      movieId: $movieId
      rating: $rating
      review: $review
    ) {
      id
      username
      movieId
      rating
      review
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($username: String!, $movieId: String!) {
    deleteUser(username: $username, movieId: $movieId) {
      id
      username
      movieId
      rating
      review
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $username: String!
    $movieId: String!
    $rating: String!
    $review: String!
  ) {
    updateRatingAndReview(
      username: $username
      movieId: $movieId
      rating: $rating
      review: $review
    ) {
      id
      username
      movieId
      rating
      review
    }
  }
`;
