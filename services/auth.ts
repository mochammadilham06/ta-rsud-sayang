import { gql } from '@apollo/client';

export const loginService = gql`
  query MyQuery($username: String = "", $password: String = "") {
    rsud_sayang_users(where: { username: { _eq: $username }, password: { _eq: $password } }, limit: 1) {
      id
      fullname
      email
      user_type
      username
    }
  }
`;

export const registerService = gql`
  mutation MyMutation($objects: [rsud_sayang_users_insert_input!] = {}) {
    insert_rsud_sayang_users(objects: $objects) {
      returning {
        id
        username
        user_type
      }
    }
  }
`;
