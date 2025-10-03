import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_CUSTOMER_SATISFACTION_FEEDBACK_GET_DATA,
  API_GET_DROPDOWN_DETAILS,
  API_ADD_CUSTOMER_SATISFACTION_FEEDBACK_DATA,
  API_DELETE_CUSTOMER_SATISFACTION_FEEDBACK,
  API_UPDATE_CUSTOMER_SATISFACTION_FEEDBACK_DATA,
  API_SAVE_CUSTOMER_FEEDBACK,
  API_CUSTOMERS_FEEDBACK_DATA,
  API_FORM_GET_DATA,
  API_GET_CATEGORY_LIST_DATA,
  API_DELETE_CATEGORY_DATA,
  API_ADD_CATEGORY_DATA,
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  customerSatisfactionGetDetails: [],
  getTypeOfFormsCategoryDropdown: [],
  getFormsStatusDropdown: [],

  status: null,
  error: null,
};
const encrypt = Encryption();
const decrypt = Decryption();

export const getCustomerSatisfactionData = createAsyncThunk(
  "CSFSevices/getCustomerSatisfactionasync",
  async () => {
    try {
      const response = await axiosInstance.post(
        API_CUSTOMER_SATISFACTION_FEEDBACK_GET_DATA.DATA
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      console.log(decryptResponse,"decryptResponse")
      //.log(JSON.stringify(response?.data?.data))
      return decryptResponse.data[0];
    } catch (error) {
      throw error;
    }
  }
);
//get category

export const getMainCategoryLists = createAsyncThunk(
  "CSFSevices/getMainCategoryListsasync",
  async () => {
    try {
      const response = await axiosInstance.post(
        API_GET_CATEGORY_LIST_DATA.DATA
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getFormsCategoryDropdown = createAsyncThunk(
  "CSFSevices/getFormsCategoryDropdownsync",
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

export const getFormsStatusDropdown = createAsyncThunk(
  "CSFSevices/getFormsStatusDropdownsync",
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

export const saveFormDetails = createAsyncThunk(
  "CSFSevices/saveFormDetailssasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);

      const response = await axiosInstance.post(
        API_ADD_CUSTOMER_SATISFACTION_FEEDBACK_DATA.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));

      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);
//add category
export const saveCategoryDetails = createAsyncThunk(
  "CSFSevices/saveCategoryDetailsasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_ADD_CATEGORY_DATA.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));

      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);
export const updateFormDetails = createAsyncThunk(
  "CSFSevices/updateFormDetailssasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.put(
        API_UPDATE_CUSTOMER_SATISFACTION_FEEDBACK_DATA.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);
export const deleteFormDetails = createAsyncThunk(
  "CSFSevices/deleteFormDetailssasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_DELETE_CUSTOMER_SATISFACTION_FEEDBACK.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);
//deleteCategoryDetails
export const deleteCategoryDetails = createAsyncThunk(
  "CSFSevices/deleteCategoryDetailsasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.put(
        API_DELETE_CATEGORY_DATA.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);
export const saveCustomerFeedbackData = createAsyncThunk(
  "CSFSevices/saveCustomerFeedbackasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);

      const response = await axiosInstance.post(
        API_SAVE_CUSTOMER_FEEDBACK.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      console.log(decryptResponse,"decryptResponse")
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);

export const getFormDataById = createAsyncThunk(
  "CSFSevices/getFormDataByIdasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_FORM_GET_DATA.DATA + payload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
console.log(decryptResponse,"de")
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);

export const getCustomerFeedbackData = createAsyncThunk(
  "CSFSevices/getCustomerFeedbackasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_CUSTOMERS_FEEDBACK_DATA.DATA + payload
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
const CSFSevicesSlice = createSlice({
  name: "CSFSevices",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCustomerSatisfactionData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCustomerSatisfactionData.fulfilled, (state, action) => {
        state.customerSatisfactionGetDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCustomerSatisfactionData.rejected, (state, action) => {
        state.customerSatisfactionGetDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })

      .addCase(saveFormDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(saveFormDetails.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(saveFormDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getFormsCategoryDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFormsCategoryDropdown.fulfilled, (state, action) => {
        state.getTypeOfFormsCategoryDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getFormsCategoryDropdown.rejected, (state, action) => {
        state.getTypeOfFormsCategoryDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getFormsStatusDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFormsStatusDropdown.fulfilled, (state, action) => {
        state.getFormsStatusDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getFormsStatusDropdown.rejected, (state, action) => {
        state.getFormsStatusDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = CSFSevicesSlice.actions;

export default CSFSevicesSlice.reducer;
