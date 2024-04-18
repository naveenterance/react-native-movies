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
    create(
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
