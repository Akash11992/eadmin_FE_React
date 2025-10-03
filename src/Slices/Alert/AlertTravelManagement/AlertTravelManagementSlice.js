import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_DELETE_ALERT_TRAVEL,
  API_GET_ALERT_TRAVEL,
  API_GET_DROPDOWN_DETAILS,
  API_INSERT_ALERT_TRAVEL,
} from "../../../Services/ApiConstant";
import Encryption from "../../../Components/Decryption/Encryption";
import Decryption from "../../../Components/Decryption/Decryption";
const initialState = {
  frequency: [],
  alertTravelDetails: [],
  alertTravelDetailsById: [],
};
const encrypt = Encryption();
const decrypt = Decryption();

export const getFrequencyDropdown = createAsyncThunk(
  "AlertTravelManagement/getFrequencyDropdownasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({ name: payload });
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const insertAlertTravel = createAsyncThunk(
  "AlertTravelManagement/insertAlertTravelasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt(payload); // Encrypt the payload
      const response = await axiosInstance.post(API_INSERT_ALERT_TRAVEL.DATA, {
        encryptedData: encryptedPayload,
      });
      const decryptedResponse = JSON.parse(
        decrypt(response.data.encryptedData)
      ); // Decrypt the response
      return { data: decryptedResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const getAlertTravel = createAsyncThunk(
  "AlertTravelManagement/getAlertTravelasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_GET_ALERT_TRAVEL.DATA);
      const decryptedResponse = JSON.parse(
        decrypt(response.data.encryptedData)
      ); 
      console.log(decryptedResponse)
      return { data: decryptedResponse.data, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const getAlertTravelbyID = createAsyncThunk(
  "AlertTravelManagement/getAlertTravelbyIDasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt(payload); // Encrypt the payload
      const response = await axiosInstance.post(API_GET_ALERT_TRAVEL.DATA, {
        encryptedData: encryptedPayload,
      });
      const decryptedResponse = JSON.parse(
        decrypt(response.data.encryptedData)
      ); // Decrypt the response
      return { data: decryptedResponse.data, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);
export const deleteAlertTravelbyID = createAsyncThunk(
  "AlertTravelManagement/deleteAlertTravelbyIDasync",
  async (id, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt({ id }); // Encrypt the payload
      const response = await axiosInstance.delete(
        API_DELETE_ALERT_TRAVEL.DATA(encryptedPayload)
      );
      const decryptedResponse = JSON.parse(
        decrypt(response.data.encryptedData)
      ); // Decrypt the response
      return { data: decryptedResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);
const AlertTravelManagementSlice = createSlice({
  name: "AlertTravelManagement",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(insertAlertTravel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertAlertTravel.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertAlertTravel.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getFrequencyDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFrequencyDropdown.fulfilled, (state, action) => {
        state.frequency = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getFrequencyDropdown.rejected, (state, action) => {
        state.frequency = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getAlertTravel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAlertTravel.fulfilled, (state, action) => {
        state.alertTravelDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getAlertTravel.rejected, (state, action) => {
        state.alertTravelDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getAlertTravelbyID.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAlertTravelbyID.fulfilled, (state, action) => {
        state.alertTravelDetailsById = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getAlertTravelbyID.rejected, (state, action) => {
        state.alertTravelDetailsById = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteAlertTravelbyID.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteAlertTravelbyID.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteAlertTravelbyID.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = AlertTravelManagementSlice.actions;

export default AlertTravelManagementSlice.reducer;