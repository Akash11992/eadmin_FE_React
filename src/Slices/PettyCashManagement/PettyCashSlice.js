import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_PETTY_CASH_CREATE_VOUCHER,
  API_PETTY_CASH_UPDATE_VOUCHER,
  API_PETTY_CASH_DELETE_VOUCHER,
  API_PETTY_CASH_GET_VOUCHER,
  API_PETTY_CASH_APPROVAL_VOUCHER,
  API_PETTY_CASH_USER_VOUCHER_APPROVAL,
  API_INSERT_PETTYCASH_CONVEYANCE,
  API_BALANCE_SUMMARY_PETTYCASH,
  API_GET_BALANCE_SUMMARY_PETTYCASH,
  API_ALERT_PETTYCASH,
  API_GET_ALERT_PETTYCASH,
  API_ALERT_PETTYCASH_DELETE,
  API_GET_ALL_EMAIL_RECORD_PETTY_CASH,
  API_PETTYCASH_EMAIL_RECORD_STATUS,
  API_UPDATE_BALANCE_SUMMARY_PETTYCASH,
  API_GET_PETTYCASH_DASHBOARD,
  API_PETTY_CASH_PAYMENT_PAID,
  API_PETTY_CASH_ADD_COMPANY,
  API_PETTY_CASH_RESEND_EMAIL,
} from "../../Services/ApiConstant";

const initialState = {
  voucherList: [],
  summaryBalanceList: [],
  dashBoardData: [],
  error: null,
  alertPettyCash: [],
  getAllAlert: [],
  alertDelete: [],
  statusEmail: [],
  getAllEmail: [],
  paymentDone: [],
};

// create voucher function code here ....
export const createVoucherCreation = createAsyncThunk(
  "PettyCash/createVoucherCreationasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_CREATE_VOUCHER.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const balanceSummary = createAsyncThunk(
  "PettyCash/balanceSummaryasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_BALANCE_SUMMARY_PETTYCASH.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const getSummaryBalanceList = createAsyncThunk(
  "PettyCash/getSummaryBalanceListasync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_GET_BALANCE_SUMMARY_PETTYCASH.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }
);

// get vouchr list function code here ....
export const getVoucherList = createAsyncThunk(
  "PettyCash/getVoucherListasync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_GET_VOUCHER.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }
);

export const getVoucherListById = createAsyncThunk(
  "PettyCash/getVoucherListByIdasync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_GET_VOUCHER.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }
);
export const getDashboardData = createAsyncThunk(
  "PettyCash/getDashboardDataasync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_GET_PETTYCASH_DASHBOARD.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }
);
// update voucher function code here ....
export const updateVoucherCreation = createAsyncThunk(
  "PettyCash/updateVoucherCreationasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        API_PETTY_CASH_UPDATE_VOUCHER.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

// delete voucher function code here ....
export const deleteVoucherCreation = createAsyncThunk(
  "PettyCash/deleteVoucherCreationasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_DELETE_VOUCHER.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
export const updateBalanceSummary = createAsyncThunk(
  "PettyCash/updateBalanceSummaryasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_UPDATE_BALANCE_SUMMARY_PETTYCASH.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
// approval voucher function code here ....
export const sendForApprovalVoucherCreation = createAsyncThunk(
  "PettyCash/sendForApprovalVoucherCreationasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_APPROVAL_VOUCHER.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

// user approval voucher function code here ....
export const userApprovalVoucher = createAsyncThunk(
  "PettyCash/userApprovalVoucherasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_USER_VOUCHER_APPROVAL.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const insertPettycashConveyance = createAsyncThunk(
  "PettyCash/insertPettycashConveyanceasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_INSERT_PETTYCASH_CONVEYANCE.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const alertInsertPettyCash = createAsyncThunk(
  "PettyCash/alertInsertPettyCash",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_ALERT_PETTYCASH.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }
);

export const getAllAlertList = createAsyncThunk(
  "PettyCash/getAllAlertList",
  async () => {
    try {
      const response = await axiosInstance.get(
        `${API_GET_ALERT_PETTYCASH.DATA}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const alertDeletePettyCash = createAsyncThunk(
  "PettyCash/alertDeletePettyCash",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_ALERT_PETTYCASH_DELETE.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }
);

export const statusEmailPettyCash = createAsyncThunk(
  "PettyCash/statusEmailPettyCash",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_PETTYCASH_EMAIL_RECORD_STATUS.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }
);

export const getAllEmailAlertList = createAsyncThunk(
  "PettyCash/getAllEmailAlertList",
  async () => {
    try {
      const response = await axiosInstance.get(
        `${API_GET_ALL_EMAIL_RECORD_PETTY_CASH.DATA}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const accountPaymentPettyCash = createAsyncThunk(
  "PettyCash/accountPaymentPettyCash",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_PAYMENT_PAID.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  }
);

export const addCompanyPettyCash = createAsyncThunk(
  "PettyCash/addCompanyPettyCash",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_ADD_COMPANY.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response.data.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
export const resendEmail = createAsyncThunk(
  "PettyCash/resendEmail",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_PETTY_CASH_RESEND_EMAIL.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response.data.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
const PettyCashSlice = createSlice({
  name: "PettyCash",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createVoucherCreation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createVoucherCreation.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(createVoucherCreation.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(balanceSummary.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(balanceSummary.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(balanceSummary.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getVoucherList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getVoucherList.fulfilled, (state, action) => {
        state.voucherList = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getVoucherList.rejected, (state, action) => {
        state.voucherList = [];
        state.status = "failed";
      })
      .addCase(getDashboardData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.dashBoardData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.dashBoardData = [];
        state.status = "failed";
      })
      .addCase(getSummaryBalanceList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getSummaryBalanceList.fulfilled, (state, action) => {
        state.summaryBalanceList = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getSummaryBalanceList.rejected, (state, action) => {
        state.summaryBalanceList = [];
        state.status = "failed";
      })
      .addCase(updateVoucherCreation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateVoucherCreation.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateVoucherCreation.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteVoucherCreation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteVoucherCreation.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteVoucherCreation.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateBalanceSummary.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateBalanceSummary.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateBalanceSummary.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(sendForApprovalVoucherCreation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(sendForApprovalVoucherCreation.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(sendForApprovalVoucherCreation.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(userApprovalVoucher.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(userApprovalVoucher.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(userApprovalVoucher.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertPettycashConveyance.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertPettycashConveyance.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertPettycashConveyance.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(alertInsertPettyCash.fulfilled, (state, action) => {
        state.alertPettyCash = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(alertInsertPettyCash.rejected, (state, action) => {
        state.alertPettyCash = [];
        state.status = "failed";
      })
      .addCase(getAllAlertList.fulfilled, (state, action) => {
        state.getAllAlert = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getAllAlertList.rejected, (state, action) => {
        state.getAllAlert = [];
        state.status = "failed";
      })
      .addCase(alertDeletePettyCash.fulfilled, (state, action) => {
        state.alertDelete = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(alertDeletePettyCash.rejected, (state, action) => {
        state.alertDelete = [];
        state.status = "failed";
      })
      .addCase(statusEmailPettyCash.fulfilled, (state, action) => {
        state.statusEmail = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(statusEmailPettyCash.rejected, (state, action) => {
        state.statusEmail = [];
        state.status = "failed";
      })
      .addCase(getAllEmailAlertList.fulfilled, (state, action) => {
        state.getAllEmail = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getAllEmailAlertList.rejected, (state, action) => {
        state.getAllEmail = [];
        state.status = "failed";
      })
      .addCase(accountPaymentPettyCash.fulfilled, (state, action) => {
        state.paymentDone = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(accountPaymentPettyCash.rejected, (state, action) => {
        state.paymentDone = [];
        state.status = "failed";
      })
      .addCase(getVoucherListById.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getVoucherListById.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getVoucherListById.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(addCompanyPettyCash.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addCompanyPettyCash.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(addCompanyPettyCash.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(resendEmail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(resendEmail.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(resendEmail.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const {} = PettyCashSlice.actions;

export default PettyCashSlice.reducer;
