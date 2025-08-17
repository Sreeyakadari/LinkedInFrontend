import { clientServer } from "../../../index.jsx";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const { data } = await clientServer.post(
        "/login",
        {
          email: user.email,
          password: user.password,
        },
        { withCredentials: true } // ✅ Added
      );

      const token = data?.token;
      const userObj = data?.user || {};
      const userId = userObj._id || userObj.id || data?.userId || data?.id;

      if (token) localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);
      if (userObj && Object.keys(userObj).length > 0) {
        localStorage.setItem("user", JSON.stringify(userObj));
      }

      thunkAPI.dispatch(getAboutUser({ token, userId }));

      if (!token) {
        return thunkAPI.rejectWithValue({ message: "token not provided" });
      }

      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      await clientServer.post(
        "/register",
        {
          username: user.username,
          password: user.password,
          email: user.email,
          name: user.name,
        },
        { withCredentials: true } // ✅ Added
      );
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async ({ token, userId } = {}, thunkAPI) => {
    try {
      const _token =
        token ||
        (typeof window !== "undefined" && localStorage.getItem("token"));
      const _userId =
        userId ||
        (typeof window !== "undefined" && localStorage.getItem("userId"));

      if (!_userId) {
        throw new Error("No userId found (are you logged in?)");
      }

      const { data } = await clientServer.get("/get_user_and_profile", {
        params: { userId: _userId },
        withCredentials: true, // ✅ Added
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || {
          message: error?.message || "Error fetching profile",
        }
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const { data } = await clientServer.get("/user/get_all_users", {
        withCredentials: true, // ✅ Added
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Error fetching users" }
      );
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const { data } = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token,
          connectionId: user.user_id,
        },
        { withCredentials: true } // ✅ Added
      );
      thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to send request"
      );
    }
  }
);

export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const { data } = await clientServer.get("/user/getConnectionRequests", {
        params: { token: user.token },
        withCredentials: true, // ✅ Added
      });
      return data.connections;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch requests"
      );
    }
  }
);

export const getMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const { data } = await clientServer.get("/user/user_connection_request", {
        params: { token: user.token },
        withCredentials: true, // ✅ Added
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch my requests"
      );
    }
  }
);

export const AcceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const { data } = await clientServer.post(
        "/user/accept_connection_request",
        {
          token: user.token,
          requestId: user.connectionId,
          action_type: user.action,
        },
        { withCredentials: true } // ✅ Added
      );
      thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
      thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to accept/decline"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  }
  return true;
});
