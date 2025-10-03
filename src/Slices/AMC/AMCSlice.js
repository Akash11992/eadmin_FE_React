import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_AMC_DELETE_CONTRACT,
  API_AMC_DROPDOWN_DETAILS,
  API_AMC_GET_CONTRACT,
  API_AMC_GET_LICENSE_DETAILS,
  API_AMC_GET_MUM_ADMIN_DETAILS,
  API_AMC_GET_OFFICE_LEASE,
  API_AMC_INSERT_UPDATE_CONTRACT,
  API_AMC_INSERT_UPDATE_DETAILS,
  API_AMC_INSERT_UPDATE_LICENSE_DETAILS,
  API_AMC_INSERT_UPDATE_OFFICE_LEASE,
  API_AMC_LICENSE_DELETE_DETAILS,
  API_AMC_MUM_ADMIN_DELETE_DETAILS,
  API_AMC_OFFICE_LEASE_DELETE_DETAILS,
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  typeDropdown: [],
  serviceSchedule: [],
  paymentTerm: [],
  amcStatus: [],
  vendor: [],
  mumAdmin: [],
  licenseType: [],
  regionWard: [],
  licensePeriod: [],
  licenses: [],
  officeLease: null,
  propertyType: [],
  contract: null,
  serviceType: [],
};
const encrypt = Encryption();
const decrypt = Decryption();

export const fetchDropdownData = createAsyncThunk(
  "AMC/fetchDropdownData",
  async ({ id, type, key }) => {
    try {
      const response = await axiosInstance.get(
        API_AMC_DROPDOWN_DETAILS.DATA(type, id)
      );
      return { key, data: response.data?.data };
    } catch (error) {
      throw error;
    }
  }
);

// Mum Admin
export const insertMumAdmin = createAsyncThunk(
  "AMC/insertMumAdminasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_AMC_INSERT_UPDATE_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      console.log(decryptResponse, "decryptResponse");
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const deleteMumAdmin = createAsyncThunk(
  "AMC/deleteMumAdminasync",
  async (id, { rejectWithValue }) => {
    try {
      const encryptedData = encrypt(id);
      const response = await axiosInstance.delete(
        API_AMC_MUM_ADMIN_DELETE_DETAILS.DATA(encryptedData)
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);
export const getMumAdmin = createAsyncThunk(
  "AMC/getMumAdminasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_AMC_GET_MUM_ADMIN_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

// License
export const insertLicense = createAsyncThunk(
  "AMC/insertLicenseasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_AMC_INSERT_UPDATE_LICENSE_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const getLicenses = createAsyncThunk(
  "AMC/getLicensesasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_AMC_GET_LICENSE_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const deleteLicense = createAsyncThunk(
  "AMC/deleteLicenseasync",
  async (id, { rejectWithValue }) => {
    try {
      const encryptedData = encrypt(id);
      const response = await axiosInstance.delete(
        API_AMC_LICENSE_DELETE_DETAILS.DATA(encryptedData)
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

// Office Lease
export const insertOfficeLease = createAsyncThunk(
  "AMC/insertOfficeLeaseasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_AMC_INSERT_UPDATE_OFFICE_LEASE.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      console.log("error:", error);

      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const getOfficeLease = createAsyncThunk(
  "AMC/getOfficeLeaseasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_AMC_GET_OFFICE_LEASE.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const deleteOfficeLease = createAsyncThunk(
  "AMC/deleteOfficeLeaseasync",
  async (id, { rejectWithValue }) => {
    try {
      const encryptedData = encrypt(id);

      const response = await axiosInstance.delete(
        API_AMC_OFFICE_LEASE_DELETE_DETAILS.DATA(encryptedData)
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

// CONTRACT

export const insertContract = createAsyncThunk(
  "AMC/insertContractasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_AMC_INSERT_UPDATE_CONTRACT.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const getContract = createAsyncThunk(
  "AMC/getContractasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_AMC_GET_CONTRACT.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const deleteContract = createAsyncThunk(
  "AMC/deleteContractasync",
  async (id, { rejectWithValue }) => {
    try {
      const encryptedData = encrypt(id);
      const response = await axiosInstance.delete(
        API_AMC_DELETE_CONTRACT.DATA(encryptedData)
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      return rejectWithValue({
        message: decryptResponse.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);
const AMCSlice = createSlice({
  name: "AMC",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        state[action.payload.key] = action.payload.data;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state[action.meta.arg.key] = [];
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(insertMumAdmin.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertMumAdmin.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertMumAdmin.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getMumAdmin.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getMumAdmin.fulfilled, (state, action) => {
        state.mumAdmin = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getMumAdmin.rejected, (state, action) => {
        state.mumAdmin = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteMumAdmin.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteMumAdmin.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteMumAdmin.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertLicense.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertLicense.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertLicense.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getLicenses.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getLicenses.fulfilled, (state, action) => {
        state.licenses = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getLicenses.rejected, (state, action) => {
        state.licenses = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteLicense.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteLicense.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteLicense.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertOfficeLease.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertOfficeLease.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertOfficeLease.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getOfficeLease.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOfficeLease.fulfilled, (state, action) => {
        state.officeLease = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getOfficeLease.rejected, (state, action) => {
        state.officeLease = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteOfficeLease.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteOfficeLease.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteOfficeLease.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertContract.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertContract.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertContract.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getContract.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getContract.fulfilled, (state, action) => {
        state.contract = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getContract.rejected, (state, action) => {
        state.contract = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteContract.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteContract.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = AMCSlice.actions;

export default AMCSlice.reducer;
