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

export const getDoctorService = gql`
  subscription MySubscription($user_type: [String!] = "") {
    data: rsud_sayang_users(where: { user_type: { _in: $user_type } }) {
      address
      id
      fullname
      username
      updated_at
      email
      user_type
    }
  }
`;
export const getDoctorById = gql`
  query MyQuery($id: Int = 10) {
    data: rsud_sayang_users(where: { id: { _eq: $id } }, limit: 1) {
      id
      fullname
      email
      address
      password
      user_type
      username
    }
  }
`;

export const updateDoctorById = gql`
  mutation MyMutation($id: Int = 10, $set: rsud_sayang_users_set_input = {}) {
    data: update_rsud_sayang_users(where: { id: { _eq: $id } }, _set: $set) {
      returning {
        id
      }
    }
  }
`;

export const deleteDoctorById = gql`
  mutation MyMutation($id: Int = 10) {
    data: delete_rsud_sayang_users(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
