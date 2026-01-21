export interface AuthUserData {
  id: string;
  email: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  accessToken: string;
}
