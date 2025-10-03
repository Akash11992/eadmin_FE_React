import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_GET_ATTACHMENT,
  API_UPDATE_ATTACHMENTS,
  API_UPLOAD_ATTACHMENTS,
} from "../../Services/ApiConstant";
const initialState = {
  attachment: [],
  status: null,
  error: null,
};

export const uploadFile = createAsyncThunk(
  "Attachment/uploadFileasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_UPLOAD_ATTACHMENTS.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);

export const getFile = createAsyncThunk(
  "Attachment/getFileasync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_GET_ATTACHMENT.DATA,
        payload
      );
      console.log(response.data, "response");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const updateFile = createAsyncThunk(
  "Attachment/updateFileasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        API_UPDATE_ATTACHMENTS.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);
const AttachmentSlice = createSlice({
  name: "Attachment",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(uploadFile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getFile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFile.fulfilled, (state, action) => {
        state.attachment = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getFile.rejected, (state, action) => {
        state.attachment = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateFile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateFile.fulfilled, (state) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateFile.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = AttachmentSlice.actions;

export default AttachmentSlice.reducer;
