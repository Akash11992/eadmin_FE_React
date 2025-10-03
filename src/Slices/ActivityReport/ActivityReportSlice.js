import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { API_ACTIVITY_LOG} from "../../Services/ApiConstant";

const initialState = {
  ActivityLog: [],
  error: null,
};

export const getActivityLog = createAsyncThunk(
  "ActivityReportData/getActivityLog",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ACTIVITY_LOG.DATA, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An unknown error occurred");
    }
  }
);
const ActivityReportSlice = createSlice({
  name: "ActivityReportData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getActivityLog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getActivityLog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getActivityLog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {} = ActivityReportSlice.actions;

export default ActivityReportSlice.reducer;
