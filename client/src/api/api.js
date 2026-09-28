import axios from "axios";
import { useMemo } from "react";
import { refreshAccessToken } from "./authApi";
import useAuthContext from "../context/useAuthContext";

export default function useApi() {
  const { accessToken, setAccessToken } = useAuthContext();

  return useMemo(() => {
    const api = axios.create({
      baseURL: "/api",
      // withCredentials: true,
    });

    api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const request = error.config;
        const isAuthEntryPoint = /\/auth\/(login|register|refresh)$/.test(
          request?.url || "",
        );

        if (
          error.response?.status !== 401 ||
          !request ||
          request._retry ||
          isAuthEntryPoint
        ) {
          return Promise.reject(error);
        }

        request._retry = true;

        try {
          const response = await refreshAccessToken();
          const nextAccessToken = response.data.accessToken;

          setAccessToken(nextAccessToken);
          request.headers = request.headers || {};
          request.headers.Authorization = `Bearer ${nextAccessToken}`;
          return api(request);
        } catch (refreshError) {
          setAccessToken(null);
          return Promise.reject(refreshError);
        }
      },
    );

    return api;
  }, [accessToken, setAccessToken]);
}
