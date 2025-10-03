import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/ApiConstant";
import {
  API_GET_BUSSINESS,
  API_CREATE_BUSSINESS,
  API_CREATE_COMPANY_DETAILS,
  API_COMPANY_DETAILS,
  API_UPDATE_COMPANY_DETAILS,
  API_DELETE_COMPANY_DETAILS,
  API_UPDATE_BY_ID_COMPANY_DETAILS,
  API_UPDATE_BUSINESS,
  API_DELETE_BUSINESS,
  API_GET_PINCODE,
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  bussinessData: [],
  allCompanyDetails: [],
  // getByIDCompanyData:[],
  pinCodeList: [],
  error: null,
};

const encrypt = Encryption();
const decrypt = Decryption();

// get bussiness function code here ....
export const getBusinessTypes = createAsyncThunk(
  "companyDetail/getBusinessTypes",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_BUSSINESS.DATA,
        encryptPayload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));

      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// create Bussiness function code here ....
export const createBussiness = createAsyncThunk(
  "companyDetail/createBussinessasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_CREATE_BUSSINESS.DATA,
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

// create company details function code here ....
export const createcompanyDetail = createAsyncThunk(
  "companyDetail/createcompanyDetailasunc",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_CREATE_COMPANY_DETAILS.DATA,
        {encryptedData: encryptPayload}
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

// get company details function code here ....
export const getALlCompanyDetail = createAsyncThunk(
  "companyDetail/getALlCompanyDetailasunc",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_COMPANY_DETAILS.DATA,
        encryptPayload
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

// update company details function code here ....
export const updateCompanyDetail = createAsyncThunk(
  "companyDetail/updateCompanyDetailasunc",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_UPDATE_COMPANY_DETAILS.DATA,{
          encryptedData:encryptPayload
        }
        
      );

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

// delete by company details function code here ....
export const deleteCompanyDetail = createAsyncThunk(
  "companyDetail/deleteCompanyDetailasunc",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_DELETE_COMPANY_DETAILS.DATA,
       { encryptedData: encryptPayload}
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

// update by id company details function code here ....
export const updateByIdCompanyDetail = createAsyncThunk(
  "companyDetail/updateByIdCompanyDetailasunc",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_UPDATE_BY_ID_COMPANY_DETAILS.DATA,{
          encryptedData:encryptPayload
        }
        
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

// update by id business function code here ....
export const updateByIdBusiness = createAsyncThunk(
  "companyDetail/updateByIdBusinessasunc",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_UPDATE_BUSINESS.DATA,
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

// delete by id business function code here ....
export const deleteByIdBusiness = createAsyncThunk(
  "companyDetail/deleteByIdBusinessasunc",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_DELETE_BUSINESS.DATA,
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

// get pincode function code here ....
export const getPinCodes = createAsyncThunk(
  "companyDetail/getPinCodes",
  async (payload) => {
    try {
      
      const encryptPayload = encrypt({ name: payload });
      const response = await axiosInstance.get(API_GET_PINCODE.DATA, {
        encryptedData: encryptPayload,
      });
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
const companyDetailSlice = createSlice({
  name: "companyDetail",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getBusinessTypes.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getBusinessTypes.fulfilled, (state, action) => {
        state.bussinessData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getBusinessTypes.rejected, (state, action) => {
        state.bussinessData = [];
        state.status = "failed";
      })
      .addCase(createBussiness.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createBussiness.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(createBussiness.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(createcompanyDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createcompanyDetail.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(createcompanyDetail.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getALlCompanyDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getALlCompanyDetail.fulfilled, (state, action) => {
        state.allCompanyDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getALlCompanyDetail.rejected, (state, action) => {
        state.allCompanyDetails = [];
        state.status = "failed";
      })
      .addCase(updateCompanyDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateCompanyDetail.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateCompanyDetail.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteCompanyDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteCompanyDetail.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteCompanyDetail.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateByIdCompanyDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateByIdCompanyDetail.fulfilled, (state, action) => {
        // state.getByIDCompanyData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateByIdCompanyDetail.rejected, (state, action) => {
        // state.getByIDCompanyData = action.payload;
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateByIdBusiness.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateByIdBusiness.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateByIdBusiness.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteByIdBusiness.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteByIdBusiness.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteByIdBusiness.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getPinCodes.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPinCodes.fulfilled, (state, action) => {
        state.pinCodeList = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPinCodes.rejected, (state, action) => {
        state.pinCodeList = [];
        state.status = "failed";
      });
  },
});

export const {} = companyDetailSlice.actions;

export default companyDetailSlice.reducer;