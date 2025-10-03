import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_GET_DROPDOWN_DETAILS,
  API_ADMIN_HELP_DESK_GET_EMAIL_BY_ID,
  API_ADMIN_HELP_DESK_GET_TICKET_DETAILS,
  API_ADMIN_HELP_DESK_INSERT_DETAILS,
  API_ADMIN_HELP_DESK_UPDATE_DETAILS,
  API_ADMIN_HELP_DESK_GET_DROPDOWN_DETAILS,
  API_ADMIN_HELP_DESK_GET_TICKET_DETAILS_BY_ID,
  API_ADMIN_HELP_DESK_GET_DASHBOARD_DETAILS,
  API_ADMIN_HELP_DESK_SEND_APPROVER,
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  ticketDetails: [],
  typeDropdown: [],
  groupDropdown: [],
  priorityDropdown: [],
  statusDropdown: [],
  employeeDropdown: [],
  ticketMediumDropdown: [],
  email: [],
  ticketDetailsById: [],
  attchInfo: [],
  dashboardDetails: [],
  service: [],
  building: [],
  location: [],
  approvedBy: [],
  exportData: [],
};

const encrypt = Encryption();
const decrypt = Decryption();
export const getTicketDetailsData = createAsyncThunk(
  "AdminHelpDesk/getTicketDetailsDataasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_GET_TICKET_DETAILS.DATA,
        { encryptedData: encryptPayload }
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
export const getTicketDetailsDataExport = createAsyncThunk(
  "AdminHelpDesk/getTicketDetailsDataExport",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_GET_TICKET_DETAILS.DATA,
        { encryptedData: encryptPayload }
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
export const getTypeDropdown = createAsyncThunk(
  "AdminHelpDesk/getTypeDropdownasync",
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
export const getAttachInfoDropdown = createAsyncThunk(
  "AdminHelpDesk/getAttachInfoDropdownasync",
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
export const getGroupDropdown = createAsyncThunk(
  "AdminHelpDesk/getGroupDropdownasync",
  async (payload) => {
    console.log(payload);
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_GET_DROPDOWN_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getPriorityDropdown = createAsyncThunk(
  "AdminHelpDesk/getPriorityDropdownasync",
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

export const getticketOwnerDropdown = createAsyncThunk(
  "AdminHelpDesk/getticketOwnerDropdownasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_GET_DROPDOWN_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getStatusDropdown = createAsyncThunk(
  "AdminHelpDesk/getStatusDropdownasync",
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

export const getTicketMediumDropdown = createAsyncThunk(
  "AdminHelpDesk/getTicketMediumDropdownasync",
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

export const getEmail = createAsyncThunk(
  "AdminHelpDesk/getEmailasync",
  async (id) => {
    try {
      const encryptedData = encrypt(id);
      const response = await axiosInstance.get(
        `${API_ADMIN_HELP_DESK_GET_EMAIL_BY_ID.DATA(encryptedData)}`
      );

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const insertTicketDetails = createAsyncThunk(
  "AdminHelpDesk/insertTicketDetailsasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_INSERT_DETAILS.DATA,
        { encryptedData: encryptedData }
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

export const getTicketDetailsByid = createAsyncThunk(
  "AdminHelpDesk/getTicketDetailsByidasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedData = encrypt(payload);
      console.log("first");
      const response = await axiosInstance.get(
        API_ADMIN_HELP_DESK_GET_TICKET_DETAILS_BY_ID.DATA(encryptedData)
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      console.log(decryptResponse, "decryptResponse");
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
      });
    }
  }
);

export const updateTicketDetails = createAsyncThunk(
  "AdminHelpDesk/updateTicketDetailsasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.put(
        API_ADMIN_HELP_DESK_UPDATE_DETAILS.DATA,
        { encryptedData: encryptPayload }
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

export const sendApprover = createAsyncThunk(
  "AdminHelpDesk/sendApproverasync",
  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload,"payload")
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_SEND_APPROVER.DATA,
        payload
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
export const getDashboardDetails = createAsyncThunk(
  "AdminHelpDesk/getDashboardDetailsasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_GET_DASHBOARD_DETAILS.DATA,
        { encryptedData: encryptPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getServiceDetails = createAsyncThunk(
  "AdminHelpDesk/getServiceDetailsasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_GET_DROPDOWN_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getBuildingDropdown = createAsyncThunk(
  "AdminHelpDesk/getBuildingDropdownasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_GET_DROPDOWN_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getLocationDropdown = createAsyncThunk(
  "AdminHelpDesk/getLocationDropdownasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADMIN_HELP_DESK_GET_DROPDOWN_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const getApprovedByDropdown = createAsyncThunk(
  "AdminHelpDesk/getApprovedByDropdownasync",
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
const AdminHelpDeskSlice = createSlice({
  name: "AdminHelpDesk",
  initialState,
  reducers: {
    // HandleHideTicket: (state, action) => {
    //   state.hideTicketTable = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getTicketDetailsData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTicketDetailsData.fulfilled, (state, action) => {
        state.ticketDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTicketDetailsData.rejected, (state, action) => {
        state.ticketDetails = action.payload;
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getTypeDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTypeDropdown.fulfilled, (state, action) => {
        state.typeDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTypeDropdown.rejected, (state, action) => {
        state.typeDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getGroupDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getGroupDropdown.fulfilled, (state, action) => {
        state.groupDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getGroupDropdown.rejected, (state, action) => {
        state.groupDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getPriorityDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPriorityDropdown.fulfilled, (state, action) => {
        state.priorityDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPriorityDropdown.rejected, (state, action) => {
        state.priorityDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getStatusDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getStatusDropdown.fulfilled, (state, action) => {
        state.statusDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getStatusDropdown.rejected, (state, action) => {
        state.statusDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getTicketMediumDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTicketMediumDropdown.fulfilled, (state, action) => {
        state.ticketMediumDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTicketMediumDropdown.rejected, (state, action) => {
        state.ticketMediumDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertTicketDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertTicketDetails.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        console.log(state, "state");
      })
      .addCase(insertTicketDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getticketOwnerDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getticketOwnerDropdown.fulfilled, (state, action) => {
        state.employeeDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getticketOwnerDropdown.rejected, (state, action) => {
        state.employeeDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getAttachInfoDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAttachInfoDropdown.fulfilled, (state, action) => {
        state.attchInfo = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getAttachInfoDropdown.rejected, (state, action) => {
        state.attchInfo = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateTicketDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateTicketDetails.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateTicketDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getEmail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getEmail.fulfilled, (state, action) => {
        state.email = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getEmail.rejected, (state, action) => {
        state.email = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getTicketDetailsByid.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTicketDetailsByid.fulfilled, (state, action) => {
        state.ticketDetailsById = action.payload.data;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTicketDetailsByid.rejected, (state, action) => {
        state.ticketDetailsById = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getDashboardDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getDashboardDetails.fulfilled, (state, action) => {
        state.dashboardDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getDashboardDetails.rejected, (state, action) => {
        state.dashboardDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getServiceDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getServiceDetails.fulfilled, (state, action) => {
        state.service = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getServiceDetails.rejected, (state, action) => {
        state.service = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getBuildingDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getBuildingDropdown.fulfilled, (state, action) => {
        state.building = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getBuildingDropdown.rejected, (state, action) => {
        state.building = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getLocationDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getLocationDropdown.fulfilled, (state, action) => {
        state.location = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getLocationDropdown.rejected, (state, action) => {
        state.location = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getApprovedByDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getApprovedByDropdown.fulfilled, (state, action) => {
        state.approvedBy = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getApprovedByDropdown.rejected, (state, action) => {
        state.approvedBy = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getTicketDetailsDataExport.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTicketDetailsDataExport.fulfilled, (state, action) => {
        state.exportData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTicketDetailsDataExport.rejected, (state, action) => {
        state.exportData = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(sendApprover.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(sendApprover.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(sendApprover.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = AdminHelpDeskSlice.actions;

export default AdminHelpDeskSlice.reducer;
