import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setAuth, clearAuth } from "../slices/AuthSlice";
import { AuthApi } from "../services/AuthService";
import { appStarted } from "@/features/store/actions/AppStarted";

const authCheckMiddleware = createListenerMiddleware();

authCheckMiddleware.startListening({
  // Trigger the middleware when the `appStarted` action is dispatched
  actionCreator: appStarted,
  effect: async (_, listenerApi) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Check token expiration before making a server request
        const isTokenExpired = (jwtToken: string): boolean => {
          try {
            const payload = JSON.parse(atob(jwtToken.split(".")[1]));
            return payload.exp * 1000 < Date.now(); // Compare expiration time with current time
          } catch {
            return true;
          }
        };

        if (isTokenExpired(token)) {
          listenerApi.dispatch(clearAuth());
          return;
        }

        const request = listenerApi.dispatch(
          AuthApi.endpoints.validateToken.initiate(null)
        );

        // Validate the token with the backend
        try {
          const data = await request.unwrap();
          if (data?.user) {
            listenerApi.dispatch(setAuth({ token, user: data.user }));
          } else {
            listenerApi.dispatch(clearAuth());
          }
        } catch (error) {
          listenerApi.dispatch(clearAuth());
        } finally {
          // Cancel the request if needed
          request.abort();
        }
      }
    } catch (error) {
      console.error("Authentication check failed");
      listenerApi.dispatch(clearAuth());
    }
  },
});

export default authCheckMiddleware;
