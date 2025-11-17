import axiosClient from "./axios-client";

type LoginType = {
  email: string;
  password: string;
};

type RegisterType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const loginMutationFn = async (data:LoginType) => await axiosClient.post("/auth/login", data);
export const registerMutationFn = async (data:RegisterType) => await axiosClient.post("/auth/register", data);