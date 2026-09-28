import axios from "axios";

let refreshRequest;

export const getCurrentUser = (api) => api.get("/auth/getme");

export const refreshAccessToken = () => {
	if (!refreshRequest) {
		refreshRequest = axios
			.post("/api/auth/refresh", {}, { withCredentials: true })
			.finally(() => {
				refreshRequest = null;
			});
	}

	return refreshRequest;
};
