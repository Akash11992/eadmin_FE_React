import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_REGISTRATION_USER,
  API_LOGIN_USER,
  API_COMPANYREGISTRATION_USER,
  API_LOGIN_USER_DETAILS,
  API_LOGOUT,
} from "../../Services/ApiConstant";
import axios from "axios";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  token: null,
  status: "idle",
  error: null,
  userDetails: [],
};
const encrypt = Encryption();
const decrypt = Decryption();
export const LoginDetails = createAsyncThunk(
  "Authentication/LoginDetailsasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/login`,
        { encryptedData: encryptPayload },
        { withCredentials: true } // Add this
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      // throw error;
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const RegistrationDetails = createAsyncThunk(
  "Authentication/RegistrationDetailsasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_REGISTRATION_USER.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      // throw error;
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const CompanyDetails = createAsyncThunk(
  "Authentication/CompanyDetailssasync",
  async (payload, { rejectWithValue }) => {
    try {
      const savedUserData = JSON.parse(localStorage.getItem("userData"));
      const token = savedUserData ? savedUserData.token : null;

      if (!token) {
        return rejectWithValue({
          statusCode: 401,
          message: "Unauthorized. No token provided.",
        });
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axiosInstance.post(
        API_COMPANYREGISTRATION_USER.DATA,
        payload,
        config
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      // throw error;
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "Authentication/getUserDetailsasync",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/getUserDetails`,
        { withCredentials: true } // Add this
      );
      return response.data;
    } catch (error) {
      throw error;
      // const statusCode = error.response ? error.response.status : 500;
      // const message =
      //   error.response?.data?.message || "An unknown error occurred.";
      // return rejectWithValue({ statusCode, message });
    }
  }
);

export const logoutCookie = createAsyncThunk(
  "Authentication/logoutCookieasync",
  async () => {
    try {
      const response = await axiosInstance.get(API_LOGOUT.DATA);
      // console.log("data login...", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
const AuthenticationSlice = createSlice({
  name: "Authentication",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(LoginDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(LoginDetails.fulfilled, (state, action) => {
        state.token = action.payload.data.token;
        state.userDetails = action.payload.data.userDetails;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(LoginDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(RegistrationDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(RegistrationDetails.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(RegistrationDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(CompanyDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(CompanyDetails.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(CompanyDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getUserDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(logoutCookie.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(logoutCookie.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(logoutCookie.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const { getUsers } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;