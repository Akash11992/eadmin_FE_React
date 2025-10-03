import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_CREATE_USER } from "../../Services/ApiConstant";
import {
  API_GET_USER_LIST,
  API_UPDATE_USER,
  API_DELETE_USER,
  API_GET_USER,
  API_GET_RM_NAME
} from "../../Services/ApiConstant";
import axiosInstance from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  CreateData: [],
  UserList: [],
  UpdateData: [],
  DeleteData: [],
  getUser: [],
  RMname: [],
  status: "idle",
  error: null,
};

const encrypt = Encryption();
const decrypt = Decryption();

export const CreateUserDetails = createAsyncThunk(
  "ManageUser/CreateUserDetails",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_CREATE_USER.DATA, {encryptedData:encryptPayload});

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
export const getUserList = createAsyncThunk(
  "ManageUser/getUserList",
  async () => {
    try {
 
      const response = await axiosInstance.get(API_GET_USER_LIST.DATA);

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
export const updateUserDetails = createAsyncThunk(
  "ManageUser/updateUserDetails",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_UPDATE_USER.DATA, {encryptedData:encryptPayload});

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
export const deleteUserDetails = createAsyncThunk(
  "ManageUser/deleteUserDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_DELETE_USER.DATA, {encryptedData:encryptPayload});

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
export const getUserById = createAsyncThunk(
  "companyDetail/getUserByIdasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_GET_USER.DATA, {encryptedData:encryptPayload});

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
export const getRMname = createAsyncThunk(
  "ManageUser/getRMname",
  async () => {
    try {
      const response = await axiosInstance.get(API_GET_RM_NAME.DATA);
     
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
const ManageUserSlice = createSlice({
  name: "ManageUser",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(CreateUserDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(CreateUserDetails.fulfilled, (state, action) => {
        state.CreateData = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(CreateUserDetails.rejected, (state, action) => {
        state.CreateData = [];
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getUserList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.UserList = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.UserList = [];
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteUserDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteUserDetails.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteUserDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.getUser = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.getUser = [];
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getRMname.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getRMname.fulfilled, (state, action) => {
        state.RMname = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getRMname.rejected, (state, action) => {
        state.RMname = [];
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});
export const {} = ManageUserSlice.actions;
export default ManageUserSlice.reducer;