import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_CREATE_VENDOR,
  API_GET_VENDOR_LIST,
  API_GET_VENDOR_BYID,
  API_DELETE_VENDOR,
  API_UPDATE_VENDOR,
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  vendorLists: [],
  CreateVendor: [],
  VendorById: [],
  deleteVendordata: [],
  updateVendordata: [],
  error: null,
};

const encrypt = Encryption();
const decrypt = Decryption();

export const getvendorLists = createAsyncThunk(
  "VendorManagementData/getvendorLists",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_VENDOR_LIST.DATA,
        {encryptPayload}
      );

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const createVendor = createAsyncThunk(
  "VendorManagementData/createVendor",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_CREATE_VENDOR.DATA, {
        encryptedData: encryptPayload,
      });

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
export const getVendorById = createAsyncThunk(
  "VendorManagementData/getVendorByIdasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_VENDOR_BYID.DATA,{encryptedData: encryptPayload}
      );

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
export const deleteVendor = createAsyncThunk(
  "VendorManagementData/deleteVendor",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_DELETE_VENDOR.DATA,
        {encryptedData:encryptPayload}
      );
      
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
export const updateVendordata = createAsyncThunk(
  "VendorManagementData/updateVendordata",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_UPDATE_VENDOR.DATA,
        {encryptedData:encryptPayload}
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
      // return response.data;
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
const VendorManagementSlice = createSlice({
  name: "VendorManagementData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getvendorLists.pending, (state) => {
        state.error = "loading";
      })
      .addCase(getvendorLists.fulfilled, (state, action) => {
        state.vendorLists = action.payload;
        state.error = null;
        state.error = "succeeded";
      })
      .addCase(getvendorLists.rejected, (state, action) => {
        state.vendorLists = [];
        state.error = action.error.message;
        state.error = "failed";
      })
      .addCase(createVendor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getVendorById.pending, (state) => {
        state.error = "loading";
      })
      .addCase(getVendorById.fulfilled, (state, action) => {
        state.VendorById = action.payload;
        state.error = null;
        state.error = "succeeded";
      })
      .addCase(getVendorById.rejected, (state, action) => {
        state.VendorById = [];
        state.error = action.error.message;
        state.error = "failed";
      })
      .addCase(deleteVendor.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateVendordata.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVendordata.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateVendordata.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {} = VendorManagementSlice.actions;

export default VendorManagementSlice.reducer;
