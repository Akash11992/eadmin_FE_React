import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_GET_EMAIL_DETAILS,
  API_GET_EMAIL_STATUS_DETAILS,
} from "../../Services/ApiConstant";

const initialState = {
  emailGetDetails: [],
  emailGetStatus: [],
  status: null,
  error: null,
};

export const getEmailData = createAsyncThunk(
  "EmailService/getEmailDataasync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_GET_EMAIL_DETAILS.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getEmailStatusData = createAsyncThunk(
  "EmailService/getEmailStatusDataasync",
  async (payload) => {
    try {
      const response = await axiosInstance.get(
        API_GET_EMAIL_STATUS_DETAILS.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const EmailSevicesSlice = createSlice({
  name: "EmailService",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getEmailData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getEmailData.fulfilled, (state, action) => {
        state.emailGetDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getEmailData.rejected, (state, action) => {
        state.emailGetDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getEmailStatusData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getEmailStatusData.fulfilled, (state, action) => {
        state.emailGetStatus = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getEmailStatusData.rejected, (state, action) => {
        state.emailGetStatus = [];
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = EmailSevicesSlice.actions;

export default EmailSevicesSlice.reducer;
