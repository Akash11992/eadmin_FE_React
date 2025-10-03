import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_GET_DROPDOWN_DETAILS,
  API_GET_USER_DETAILS_BY_CONTACT,
  API_VISITOR_MANAGEMENT_DELETE,
  API_VISITOR_MANAGEMENT_GET,
  API_VISITOR_MANAGEMENT_INSERT,
  API_VISITOR_MANAGEMENT_UPDATE,
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  visitorGetDetails: [],
  genderDropdown: [],
  PurposeOfVisitDropdown: [],
  appointmentStatusDropdown: [],
  cardTypeDropdown: [],
  visitorGetDetailsByContact: [],
  status: null,
  error: null,
};

const encrypt = Encryption();
const decrypt = Decryption();
export const insertVisitorManagement = createAsyncThunk(
  "VisitorManagement/insertVisitorManagementasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload)
      const response = await axiosInstance.post(
        API_VISITOR_MANAGEMENT_INSERT.DATA,{
          encryptedData
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const getVisitorManagementData = createAsyncThunk(
  "VisitorManagement/getVisitorManagementDataasync",
  async (params) => {
    try {
      const encryptedData = encrypt(params)
      const response = await axiosInstance.post(
        API_VISITOR_MANAGEMENT_GET.DATA,{
          encryptedData
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const updateVisitorManagementData = createAsyncThunk(
  "VisitorManagement/updateVisitorManagementDatasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload)
      const response = await axiosInstance.post(
        API_VISITOR_MANAGEMENT_UPDATE.DATA,{
          encryptedData
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const getGenderDropdown = createAsyncThunk(
  "VisitorManagement/getGenderDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({name:payload});
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
         encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);

export const getPurposeOfVisitDropdown = createAsyncThunk(
  "VisitorManagement/getPurposeOfVisitDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({name:payload});
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
         encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);

export const getAppointmentStatusDropdown = createAsyncThunk(
  "VisitorManagement/getAppointmentStatusDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({name:payload});
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
         encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);

export const getCardTypeDropdown = createAsyncThunk(
  "VisitorManagement/getCardTypeDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({name:payload});
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
         encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);

export const deleteVisitorManagement = createAsyncThunk(
  "VisitorManagement/deleteVisitorManagementAsync",
  async (visitor_id) => {
    try {
      const encryptPayload = encrypt(visitor_id);
      const response = await axiosInstance.put(
        `${API_VISITOR_MANAGEMENT_DELETE.DATA(encryptPayload)}`
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getVisitorDetailsByConact = createAsyncThunk(
  "VisitorManagement/getVisitorDetailsByConactasync",
  async (contactNumber) => {
    try {
      const encryptPayload = encrypt(contactNumber);
      const response = await axiosInstance.post(
        `${API_GET_USER_DETAILS_BY_CONTACT.DATA(encryptPayload)}`
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

const VisitorManagementReducer = createSlice({
  name: "VisitorManagement",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(insertVisitorManagement.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertVisitorManagement.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertVisitorManagement.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getVisitorManagementData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getVisitorManagementData.fulfilled, (state, action) => {
        state.visitorGetDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getVisitorManagementData.rejected, (state, action) => {
        state.visitorGetDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateVisitorManagementData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateVisitorManagementData.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateVisitorManagementData.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getGenderDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getGenderDropdown.fulfilled, (state, action) => {
        state.genderDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getGenderDropdown.rejected, (state, action) => {
        state.genderDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getPurposeOfVisitDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPurposeOfVisitDropdown.fulfilled, (state, action) => {
        state.PurposeOfVisitDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPurposeOfVisitDropdown.rejected, (state, action) => {
        state.PurposeOfVisitDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getAppointmentStatusDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAppointmentStatusDropdown.fulfilled, (state, action) => {
        state.appointmentStatusDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getAppointmentStatusDropdown.rejected, (state, action) => {
        state.appointmentStatusDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getCardTypeDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCardTypeDropdown.fulfilled, (state, action) => {
        state.cardTypeDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCardTypeDropdown.rejected, (state, action) => {
        state.cardTypeDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteVisitorManagement.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteVisitorManagement.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteVisitorManagement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getVisitorDetailsByConact.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getVisitorDetailsByConact.fulfilled, (state, action) => {
        state.visitorGetDetailsByContact = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getVisitorDetailsByConact.rejected, (state, action) => {
        state.visitorGetDetailsByContact = [];
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = VisitorManagementReducer.actions;

export default VisitorManagementReducer.reducer;
