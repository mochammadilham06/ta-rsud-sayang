export interface User {
  user_id: string;
  username: string;
  user_type: string;
  email: string;
  fullname: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}
