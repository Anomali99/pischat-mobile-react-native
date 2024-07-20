import axios, {AxiosResponse, AxiosInstance, AxiosError} from 'axios';
import {IP_API} from '@env';

const SERVER_IP = IP_API || '127.0.0.1';

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  name: string;
  username: string;
  password: string;
}

interface User {
  user_uuid: string;
  username: string;
  name: string;
}

type AuthResponse = {
  status: number;
  message: string;
  data: User;
};

type UsersResponse = {
  status: number;
  message: string;
  data: User[];
};

interface ErrorResponse {
  status: number;
  message: string;
}

const API_BASE_URL = `http://${SERVER_IP}`;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
  headers: {'Content-Type': 'application/json'},
});

const login = async (
  data: LoginData,
): Promise<AuthResponse | ErrorResponse> => {
  const LOGIN_ENDPOINT = '/auth/login';
  try {
    const res: AxiosResponse<AuthResponse> = await apiClient.post(
      LOGIN_ENDPOINT,
      data,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data as ErrorResponse;
      } else if (error.request) {
        return {
          status: 504,
          message: 'No response received from the server',
        } as ErrorResponse;
      }
    }
    return {
      status: 500,
      message: 'An unexpected error occurred',
    } as ErrorResponse;
  }
};

const register = async (
  data: RegisterData,
): Promise<AuthResponse | ErrorResponse> => {
  const REGISTER_ENDPOINT = '/auth/register';
  try {
    const res: AxiosResponse<AuthResponse> = await apiClient.post(
      REGISTER_ENDPOINT,
      data,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data as ErrorResponse;
      } else if (error.request) {
        return {
          status: 504,
          message: 'No response received from the server',
        } as ErrorResponse;
      }
    }
    return {
      status: 500,
      message: 'An unexpected error occurred',
    } as ErrorResponse;
  }
};

const getUsers = async (
  uuid: string,
): Promise<UsersResponse | ErrorResponse> => {
  const USERS_ENDPOINT = `/user/${uuid}`;
  try {
    const res: AxiosResponse<UsersResponse> = await apiClient.get(
      USERS_ENDPOINT,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data as ErrorResponse;
      } else if (error.request) {
        return {
          status: 504,
          message: 'No response received from the server',
        } as ErrorResponse;
      }
    }
    return {
      status: 500,
      message: 'An unexpected error occurred',
    } as ErrorResponse;
  }
};

export {login, register, getUsers, SERVER_IP};
