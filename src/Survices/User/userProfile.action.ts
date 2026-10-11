"use server";

import { getMyToken } from "@/Utillitez/getMyToken";

export interface UpdateUserValues {
  name: string;
  email: string;
  phone: string;
}

export interface ChangePasswordValues {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface ApiResponse {
  status?: string;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

async function authHeaders() {
  const tokenData = await getMyToken();

  if (!tokenData?.token) {
    throw new Error("Please login first");
  }

  return {
    "Content-Type": "application/json",
    token: tokenData.token,
  };
}

async function parseResponse(response: Response): Promise<ApiResponse> {
  const payload: ApiResponse = await response.json().catch(() => ({
    message: "Invalid response from server",
  }));

  if (!response.ok) {
    throw new Error(payload.message ? String(payload.message) : `Request failed: ${response.status}`);
  }

  return payload;
}

export async function updateUserData(values: UpdateUserValues): Promise<ApiResponse> {
  const headers = await authHeaders();

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/users/updateMe/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(values),
  });

  return parseResponse(response);
}

export async function changeUserPassword(values: ChangePasswordValues): Promise<ApiResponse> {
  const headers = await authHeaders();

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/users/changeMyPassword`, {
    method: "PUT",
    headers,
    body: JSON.stringify(values),
  });

  return parseResponse(response);
}

export async function requestForgotPassword(email: string): Promise<ApiResponse> {
  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return parseResponse(response);
}
