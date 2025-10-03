import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_GET_DROPDOWN_DETAILS,
  API_PETTY_CASH_CREATED_BY_LIST,
  API_PETTY_CASH_DROPDOWN,
} from "../../Services/ApiConstant";
import { API_PETTY_CASH_TRAVEL_MODE } from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";
const initialState = {
  PettyCashStatus: [],
  voucherDetailsData: [],
  subCompanyData: [],
  travelModeData: [],
  createdByList: [],
  error: null,
};
const encrypt = Encryption()
const decrypt = Decryption()
// get PettyCashStatus list function code here ....
export const getPettyCashStatus = createAsyncThunk(
  "PettyCashDropdown/getPettyCashStatus",
  async (payload) => {
    try {
      const response = await axiosInstance.get(
        `${API_PETTY_CASH_DROPDOWN.DATA}?type=${payload}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// get getVoucherDetails list function code here ....
export const getVoucherDetails = createAsyncThunk(
  "PettyCashDropdown/getVoucherDetails",
  async (payload) => {
    try {
      const response = await axiosInstance.get(
        `${API_PETTY_CASH_DROPDOWN.DATA}?type=${payload}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
// get getVoucherDetails list function code here ....
export const getSubCompanyDetails = createAsyncThunk(
  "PettyCashDropdown/getSubCompanyDetails",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_DROPDOWN.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// get TravelModeDetails list function code here ....
export const getTravelModeDetails = createAsyncThunk(
  "PettyCashDropdown/getTravelModeDetails",
  async (payload) => {
    try {
      const response = await axiosInstance.get(
        `${API_PETTY_CASH_DROPDOWN.DATA}?type=${payload}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
// get created by list function code here ....
export const getCreatedByList = createAsyncThunk(
  "PettyCashDropdown/getCreatedByList",
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

const PettyCashDropdownSlice = createSlice({
  name: "PettyCashDropdown",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPettyCashStatus.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPettyCashStatus.fulfilled, (state, action) => {
        state.error = null;
        state.PettyCashStatus = action.payload;
        state.status = "succeeded";
      })
      .addCase(getPettyCashStatus.rejected, (state, action) => {
        state.PettyCashStatus = [];
        state.status = "failed";
      })
      .addCase(getVoucherDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getVoucherDetails.fulfilled, (state, action) => {
        state.error = null;
        state.voucherDetailsData = action.payload;
        state.status = "succeeded";
      })
      .addCase(getVoucherDetails.rejected, (state, action) => {
        state.voucherDetailsData = [];
        state.status = "failed";
      })
      .addCase(getSubCompanyDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getSubCompanyDetails.fulfilled, (state, action) => {
        state.error = null;
        state.subCompanyData = action.payload;
        state.status = "succeeded";
      })
      .addCase(getSubCompanyDetails.rejected, (state, action) => {
        state.subCompanyData = [];
        state.status = "failed";
      })
      .addCase(getTravelModeDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTravelModeDetails.fulfilled, (state, action) => {
        state.error = null;
        state.travelModeData = action.payload;
        state.status = "succeeded";
      })
      .addCase(getTravelModeDetails.rejected, (state, action) => {
        state.travelModeData = [];
        state.status = "failed";
      })
      .addCase(getCreatedByList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCreatedByList.fulfilled, (state, action) => {
        state.error = null;
        state.createdByList = action.payload;
        state.status = "succeeded";
      })
      .addCase(getCreatedByList.rejected, (state, action) => {
        state.createdByList = [];
        state.status = "failed";
      });
  },
});

export const {} = PettyCashDropdownSlice.actions;

export default PettyCashDropdownSlice.reducer;
