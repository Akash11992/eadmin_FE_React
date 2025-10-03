import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_GET_PROFILE,
  API_GET_PROFILE_DETAILS,
} from "../../Services/ApiConstant";
import axiosInstance from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";
const initialState = {
  profileData: [],
  error: null,
};
const encrypt = Encryption();
const decrypt = Decryption();

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(API_GET_PROFILE_DETAILS.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const updateProfileDetails = createAsyncThunk(
  "profile/updateProfileDetailsasync",
  async (updatedData, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(updatedData);
      const response = await axiosInstance.post(API_GET_PROFILE.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileData = action.payload;
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(updateProfileDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfileDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateProfileDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const {} = ProfileSlice.actions;

export default ProfileSlice.reducer;
