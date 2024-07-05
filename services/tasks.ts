import { gql } from '@apollo/client';

// export const getTaskPasien = gql`
//   query MyQuery($user_id: Int = 10) {
//     rsud_sayang_task(where: { user_id: { _eq: $user_id } }, order_by: { created_at: desc }) {
//       user_id
//       task_id
//       type
//       next_step
//       current_step
//       status
//       approved_by
//     }
//   }
// `;

export const getTaskPasien = gql`
  subscription MySubscription($user_id: Int = 0, $status: [String!] = "") {
    data: rsud_sayang_task(where: { user_id: { _eq: $user_id }, status: { _in: $status } }, order_by: { created_at: desc }) {
      task_id
      user_id
      next_step
      current_step
      created_by
      approved_by
      type
      status
      reason_progress
      flows
      user {
        fullname
      }
    }
  }
`;

export const getTaskDokter = gql`
  subscription MySubscription($status: [String!] = "") {
    data: rsud_sayang_task(where: { status: { _in: $status } }, order_by: { created_at: desc }) {
      task_id
      user_id
      next_step
      current_step
      created_by
      approved_by
      type
      status
      reason_progress
      flows
      user {
        fullname
      }
      images_rel {
        images
      }
    }
  }
`;

export const getTaskWithId = gql`
  query MyQuery($user_id: Int = 0, $task_id: uuid = "") {
    data: rsud_sayang_task(where: { user_id: { _eq: $user_id }, task_id: { _eq: $task_id } }, order_by: { created_at: desc }) {
      task_id
      user_id
      next_step
      current_step
      created_by
      approved_by
      type
      status
      reason_progress
      flows
      user {
        fullname
      }
      images_rel {
        images
        description
      }
    }
  }
`;

export const postTask = gql`
  mutation MyMutation($objects: [rsud_sayang_task_insert_input!] = {}) {
    data: insert_rsud_sayang_task(objects: $objects) {
      returning {
        task_id
        type
      }
    }
  }
`;

export const updateTask = gql`
  mutation MyMutation($set: rsud_sayang_task_set_input = {}, $task_id: uuid = "") {
    data: update_rsud_sayang_task(where: { task_id: { _eq: $task_id } }, _set: $set) {
      returning {
        task_id
        next_step
        status
      }
    }
  }
`;

export const postImages = gql`
  mutation MyMutation($objects: [rsud_sayang_images_insert_input!] = {}) {
    data: insert_rsud_sayang_images(objects: $objects) {
      returning {
        id
        images
        task_image_rel {
          user_id
        }
        task_id
      }
    }
  }
`;

export const getImagesById = gql`
  query MyQuery($task_id: uuid = "") {
    data: rsud_sayang_images(where: { task_id: { _eq: $task_id } }) {
      id
      task_id
      images
      description
    }
  }
`;

export const updateImages = gql`
  mutation MyMutation($id: bigint = "", $description: String = "") {
    data: update_rsud_sayang_images(where: { id: { _eq: $id } }, _set: { description: $description }) {
      returning {
        id
        task_id
      }
    }
  }
`;
