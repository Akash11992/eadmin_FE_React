import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { API_ADD_SCHEDULER } from "../../Services/ApiConstant";
const initialState = {};
export const addScheduler = createAsyncThunk(
  "Scheduler/addSchedulerasync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_ADD_SCHEDULER.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const SchedulerSlice = createSlice({
  name: "Scheduler",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addScheduler.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addScheduler.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(addScheduler.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = SchedulerSlice.actions;

export default SchedulerSlice.reducer;
