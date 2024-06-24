export interface TaskRecord {
  task_id: string;
  type: string;
  user: string;
  created_by: string;
  status: string;
  approved_by?: string;
}
export interface TaskRecordWithImage extends TaskRecord {
  images_rel?: {
    images: string;
  };
}
