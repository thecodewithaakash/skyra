import { useEffect } from "react";
import { getCurrentUser, refreshAccessToken } from "../api/authApi";
import useApi from "../api/api";
import useAuthContext from "./useAuthContext";

const AuthUserLoader = () => {
  const {
    accessToken,
    setAccessToken,
    setUser,
    setIsUserLoading,
    isAuthInitialized,
    setIsAuthInitialized,
  } = useAuthContext();
  const api = useApi();

  useEffect(() => {
    let isCurrentRequest = true;

    const loadUser = async () => {
      if (!isAuthInitialized) {
        setIsUserLoading(true);

        try {
          const response = await refreshAccessToken();
          const restoredAccessToken = response.data?.accessToken;

          if (!restoredAccessToken) {
            throw new Error("Refresh response did not include an access token.");
          }

          if (isCurrentRequest) {
            setAccessToken(restoredAccessToken);
            setIsAuthInitialized(true);
          }
        } catch {
          if (isCurrentRequest) {
            setUser(null);
            setAccessToken(null);
            setIsAuthInitialized(true);
            setIsUserLoading(false);
          }
        }

        return;
      }

      if (!accessToken) {
        setUser(null);
        setIsUserLoading(false);
        return;
      }

      setIsUserLoading(true);

      try {
        const response = await getCurrentUser(api);
        if (isCurrentRequest) {
          setUser(response.data?.data?.user || null);
        }
      } catch (error) {
        if (!isCurrentRequest) return;

        setUser(null);
        if (error.response?.status === 401) {
          setAccessToken(null);
        }
      } finally {
        if (isCurrentRequest) {
          setIsUserLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isCurrentRequest = false;
    };
  }, [
    accessToken,
    api,
    isAuthInitialized,
    setAccessToken,
    setIsAuthInitialized,
    setIsUserLoading,
    setUser,
  ]);

  return null;
};

export default AuthUserLoader;