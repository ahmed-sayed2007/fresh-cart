"use server";

import type { ChangePasswordPayload, LoggedInUser, UpdateUserPayload } from "@/Interface/user.interface";
import type { UserOrdersResponse } from "@/Interface/order.interface";
import { getMyToken } from "@/Utillitez/getMyToken";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

async function getRouteApiToken(): Promise<string> {
  const tokenData = await getMyToken();
  const apiToken = tokenData?.token;

  if (!apiToken || typeof apiToken !== "string") {
    throw new Error("Please login to continue.");
  }

  return apiToken;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result as T;
}

export async function getLoggedInUser(): Promise<LoggedInUser | null> {
  try {
    const apiToken = await getRouteApiToken();

    const response = await fetch(`${BASE_URL}/users/getMe`, {
      method: "GET",
      headers: { token: apiToken },
      cache: "no-store",
    });

    const result = await parseResponse<{ data: LoggedInUser }>(response);
    return result.data;
  } catch {
    return null;
  }
}

export async function updateUserData(values: UpdateUserPayload) {
  const apiToken = await getRouteApiToken();

  const response = await fetch(`${BASE_URL}/users/updateMe`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: apiToken,
    },
    body: JSON.stringify(values),
  });

  return parseResponse(response);
}

export async function changeUserPassword(values: ChangePasswordPayload) {
  const apiToken = await getRouteApiToken();

  const response = await fetch(`${BASE_URL}/users/changeMyPassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: apiToken,
    },
    body: JSON.stringify(values),
  });

  return parseResponse(response);
}

export async function requestForgotPassword(email: string) {
  const response = await fetch(`${BASE_URL}/auth/forgotPasswords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return parseResponse(response);
}

export async function getUserOrders(): Promise<UserOrdersResponse["data"]> {
  const tokenData = await getMyToken();
  const apiToken = tokenData?.token;

  if (!apiToken || typeof apiToken !== "string") {
    throw new Error("Please login to view your orders.");
  }

  let userId = tokenData?.id;

  if (!userId) {
    try {
      const decoded = jwtDecode<{ id?: string }>(apiToken);
      userId = decoded.id;
    } catch {
      userId = undefined;
    }
  }

  if (!userId) {
    throw new Error("Could not resolve your user id.");
  }

  const response = await fetch(`${BASE_URL}/orders/user/${userId}`, {
    method: "GET",
    headers: { token: apiToken },
    cache: "no-store",
  });

  const result = await parseResponse<UserOrdersResponse>(response);
  return result.data ?? [];
}
