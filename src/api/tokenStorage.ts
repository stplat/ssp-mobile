import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "ssp_access_token";
let memoryToken: string | null = null;

function hasLocalStorage() {
  return typeof globalThis !== "undefined" && "localStorage" in globalThis;
}

export async function saveAccessToken(token: string) {
  if (Platform.OS === "web" && hasLocalStorage()) {
    globalThis.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }
  memoryToken = token;
}

export async function getAccessToken() {
  if (Platform.OS === "web" && hasLocalStorage()) {
    return globalThis.localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return memoryToken;
}

export async function clearAccessToken() {
  if (Platform.OS === "web" && hasLocalStorage()) {
    globalThis.localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }
  memoryToken = null;
}
