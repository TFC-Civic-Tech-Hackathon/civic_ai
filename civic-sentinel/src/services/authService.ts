// src/services/authService.ts
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  bizzName: string;
  bizzVertical: string;
  location: string;
  bizzSize: string;
  // ...other registration fields
}

export const login = async (data: LoginData) => {
  const response = await axios.post("auth/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  const { access_token, user } = response.data;
  localStorage.setItem("token", access_token);
  localStorage.setItem("user", JSON.stringify(user));
  return response.data;
};

export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post("auth/signup", JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const { access_token, user } = response.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
