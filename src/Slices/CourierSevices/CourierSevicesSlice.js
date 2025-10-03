import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_GET_DROPDOWN_DETAILS,
  API_INWARD_COURIER_GET_DATA,
  API_INWARD_COURIER_INSERT_DATA,
  API_UPDATE_INWARD_COURIER_DETAILS,
  API_DEPARTMENT_DROPDOWN_DETAILS,
  API_LOCATION_DROPDOWN_DETAILS,
  API_DELETE_INWARD_COURIER,
  API_GET_OUTWARD_DETAILS,
  API_INSERT_OUTWARD_DETAILS,
  API_REQUEST_INSERT_OUTWARD_DETAILS,
  API_SHIPPER_NAME_DROPDOWN_DETAILS,
  API_GET_VENDOR_DROPDOWN_DETAILS,
  API_GET_DESTINATION_DETAILS,
  API_GET_RECEIVER_DROPDOWN_DETAILS,
  API_GET_EMPLOYEE_NAME_DETAILS,
  API_GET_EMPLOYEE_ID_DETAILS,
  API_GET_REASON_DROPDOWN_DETAILS,
  API_UPDATE_OUTWARD_COURIER_DETAILS,
  API_DELETE_OUTWARD_COURIER,
  API_UPLOAD_COURIER_REPORT,
  API_GET_COMPANY,
  API_INSERT_COURIER_ACCOUNT_CODE,
  API_UPLOAD_PIN_CODE,
  API_BULK_UPLOAD_OUTWARD,
  API_GET_COURIER_REPORT,
  API_BULK_UPLOAD_INWARD,
  API_INWARD_COURIER_UPDATE_STATUS,
  API_GET_COURIER_COMPANY_NAME,
  API_MISSING_AWB_RECORDS,
  API_UPDATE_PIN_CODE,
  API_DELETE_PIN_CODE,
  API_UPDATE_COURIER_ACCOUNT_CODE,
  API_DELETE_COURIER_ACCOUNT_CODE,
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";
// import Encryption from "../../Components/Decryption/Encryption";
// import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  inwardGetDetails: [],
  typeOfCourierDropdown: [],
  departmentDropdown: [],
  courierModeDropdown: [],
  courierTypeDropdown: [],
  returnReasonDropdown: [],
  shipperNameDropdown: [],
  locationDropdown: [],
  outwardGetDetails: [],
  personalOfficialDropdown: [],
  intlDomLocDropdown: [],
  vendorNameDropdown: [],
  destination: [],
  receiverNameDropdown: [],
  courierStatusDropdown: [],
  empolyeeName: [],
  employeeId: [],
  companybyaccount: [],
  bulkUploadOutward: [],
  courierReport: [],
  bulkUploadInward: [],
  getCompanyDetails: [],
  missingAWBRecords: [],
  status: null,
  error: null,
};

const encrypt = Encryption();
const decrypt = Decryption();

export const deleteInwardCourier = createAsyncThunk(
  "CourierService/deleteInwardCourierAsync",
  async (reference_no) => {
    try {
      const encryptPayload = encrypt(reference_no);
      const response = await axiosInstance.put(
        `${API_DELETE_INWARD_COURIER.DATA(encryptPayload)}`
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteOutwardCourier = createAsyncThunk(
  "CourierService/deleteOutwardCourierAsync",
  async (reference_no) => {
    try {
      const encryptPayload = encrypt(reference_no);
      const response = await axiosInstance.put(
        `${API_DELETE_OUTWARD_COURIER.DATA(encryptPayload)}`
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const updateStatusIntwardCourier = createAsyncThunk(
  "CourierService/updateStatusIntwardCourierAsync",
  async (reference_no) => {
    try {
      const encryptPayload = encrypt(reference_no);
      const response = await axiosInstance.get(
        API_INWARD_COURIER_UPDATE_STATUS.DATA(encryptPayload)
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const updateInwardCourier = createAsyncThunk(
  "CourierService/updateInwardCourierasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.put(
        API_UPDATE_INWARD_COURIER_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      // console.log(response, "response");
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const updateOutwardCourier = createAsyncThunk(
  "CourierService/updateOutwardCourierasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.put(
        API_UPDATE_OUTWARD_COURIER_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );

      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// export const getInwardCourierData = createAsyncThunk(
//   "CourierService/getInwardCourierDataasync",
//   async (uniqueNo) => {
//     try {
//       const encryptPayload = encrypt(uniqueNo);
//       const response = await axiosInstance.post(
//         API_INWARD_COURIER_GET_DATA.DATA,
//         {
//           encryptPayload,
//         }
//       );
//       const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
//       return { data: decryptResponse, statusCode: response.status };
//     } catch (error) {
//       throw error;
//     }
//   }
// );
export const getInwardCourierData = createAsyncThunk(
  "CourierService/getInwardCourierDataasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(
        API_INWARD_COURIER_GET_DATA.DATA,
        {
          encryptedData,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const getCourierCompanyData = createAsyncThunk(
  "CourierService/getCourierCompanyDataasync",
  async () => {
    try {
      const encryptPayload = encrypt({});

      const response = await axiosInstance.get(
        `${API_GET_COURIER_COMPANY_NAME.DATA}?encryptedData=${encryptPayload}`
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));

      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getOutwardCourierData = createAsyncThunk(
  "CourierService/getOutwardCourierDataasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(API_GET_OUTWARD_DETAILS.DATA, {
        encryptedData,
      });
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const insertInwardCourier = createAsyncThunk(
  "CourierService/insertInwardCourierasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(
        API_INWARD_COURIER_INSERT_DATA.DATA,
        { encryptedData: encryptedData }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const insertOutwardCourier = createAsyncThunk(
  "CourierService/insertOutwardCourierasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_INSERT_OUTWARD_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const insertCourierAccountCode = createAsyncThunk(
  "CourierService/insertCourierAccountCodeasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_INSERT_COURIER_ACCOUNT_CODE.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const updateCourierAccountCode = createAsyncThunk(
  "CourierService/updateCourierAccountCodeasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.put(
        API_UPDATE_COURIER_ACCOUNT_CODE.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const deleteCourierAccountCode = createAsyncThunk(
  "CourierService/deleteCourierAccountCodeasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_DELETE_COURIER_ACCOUNT_CODE.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const insertRequestOutwardCourier = createAsyncThunk(
  "CourierService/insertRequestOutwardCouriersync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_REQUEST_INSERT_OUTWARD_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const getTypeOfCourierDropdown = createAsyncThunk(
  "CourierService/getTypeOfCourierDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({ name: payload });
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
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
export const getPersonalOfficialDropdown = createAsyncThunk(
  "CourierService/getPersonalOfficialDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({ name: payload });
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
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
export const getIntlDomLocDropdown = createAsyncThunk(
  "CourierService/getIntlDomLocDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptPayload,
      });
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const getDepartmentDropdown = createAsyncThunk(
  "CourierService/getDepartmentDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        API_DEPARTMENT_DROPDOWN_DETAILS.DATA,
        {
          encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const getCourierModeDropdown = createAsyncThunk(
  "CourierService/getCourierModeDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({ name: payload });
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptPayload,
      });
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      // return { data: decryptResponse, statusCode: response.status };
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const getCourierStatusDropdown = createAsyncThunk(
  "CourierService/getCourierStatusDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({ name: payload });
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
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
export const getCourierTypeDropdown = createAsyncThunk(
  "CourierService/getCourierTypeDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptPayload,
      });
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const getReturnReasonDropdown = createAsyncThunk(
  "CourierService/getReturnReasonDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({ name: payload });
      const response = await axiosInstance.get(
        API_GET_REASON_DROPDOWN_DETAILS.DATA,
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
export const getShipperNameDropdown = createAsyncThunk(
  "CourierService/getShipperNameDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({ name: payload });

      const response = await axiosInstance.get(
        API_SHIPPER_NAME_DROPDOWN_DETAILS.DATA,
        {
          encryptedData: encryptPayload,
        }
      );
      // console.log(response, "response");
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const getReceiverNameDropdown = createAsyncThunk(
  "CourierService/getReceiverNameDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        API_GET_RECEIVER_DROPDOWN_DETAILS.DATA,
        {
          encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const getVendorNameDropdown = createAsyncThunk(
  "CourierService/getVendorNameDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        API_GET_VENDOR_DROPDOWN_DETAILS.DATA,
        {
          encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const getLocationDropdown = createAsyncThunk(
  "CourierService/getLocationDropdownsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        API_LOCATION_DROPDOWN_DETAILS.DATA,
        {
          encryptPayload,
        }
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
// export const getDestination = createAsyncThunk(
//   "CourierService/getDestinationsync",
//   async (Pincode) => {
//     const encryptPayload = encrypt(Pincode);
//     const response = await axiosInstance.get(
//       `${API_GET_DESTINATION_DETAILS.DATA}${encryptPayload}`
//     );
//     // return response.data;
//     const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
//     return decryptResponse
//   }
// );

export const getDestination = createAsyncThunk(
  "CourierService/getDestinationsync",
  async (Pincode) => {
    try {
      const encryptPayload = encrypt(Pincode);
      const response = await axiosInstance.get(
        `${API_GET_DESTINATION_DETAILS.DATA}${encryptPayload}`
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

// export const getEmpolyeeName = createAsyncThunk(
//   "CourierService/getEmpolyeeNamesync",
//   async (user_id) => {
//     // const encryptPayload = encrypt(user_id);
//     const response = await axiosInstance.get(
//       `${API_GET_EMPLOYEE_NAME_DETAILS.DATA}${user_id}`
//     );
//     // return response.data;
//     const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
//     return { data: decryptResponse, statusCode: response.status };
//   }
// );
export const getEmpolyeeName = createAsyncThunk(
  "CourierService/getEmployeeNamesync",
  async (user_id) => {
    try {
      const encryptPayload = encrypt(user_id);
      const response = await axiosInstance.get(
        `${API_GET_EMPLOYEE_NAME_DETAILS.DATA}${encryptPayload}`
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const getEmpolyeeId = createAsyncThunk(
  "CourierService/getEmpolyeeIdsync",
  async (full_name) => {
    const encryptPayload = encrypt(full_name);
    const response = await axiosInstance.get(
      `${API_GET_EMPLOYEE_ID_DETAILS.DATA}${encryptPayload}`
    );
    // return response.data;
    const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
    return { data: decryptResponse, statusCode: response.status };
  }
);
export const uploadCourierReport = createAsyncThunk(
  "CourierService/uploadCourierReportasync",
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_UPLOAD_COURIER_REPORT.DATA,
        reportData
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload report"
      );
    }
  }
);
export const getCompanyDetailsByAccount = createAsyncThunk(
  "CourierService/getCompanyDetailsByAccountsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({ name: payload });
      const response = await axiosInstance.get(API_GET_COMPANY.DATA, {
        encryptPayload: encryptPayload,
      });

      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// pincode upload function code here..
export const hanldePinCodeUpload = createAsyncThunk(
  "CourierService/hanldePinCodeUploadasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_UPLOAD_PIN_CODE.DATA, {
        encryptedData: encryptPayload,
      });
      // return response.data;
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

// pincode update function code here..
export const hanldePinCodeUpdate = createAsyncThunk(
  "CourierService/hanldePinCodeUpdateasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.put(API_UPDATE_PIN_CODE.DATA, {
        encryptedData: encryptPayload,
      });
      // return response.data;
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

// pincode update function code here..
export const hanldePinCodeDelete = createAsyncThunk(
  "CourierService/hanldePinCodeDeleteasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_DELETE_PIN_CODE.DATA, {
        encryptedData: encryptPayload,
      });
      // return response.data;
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

export const bulkUploadFile = createAsyncThunk(
  "CourierService/bulkUploadFilesync",
  async (payload) => {
    try {
      // const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_BULK_UPLOAD_OUTWARD.DATA,
        payload
      );
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);
export const bulkUploadFileInward = createAsyncThunk(
  "CourierService/bulkUploadFileInwardsync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_BULK_UPLOAD_INWARD.DATA, {
        encryptPayload,
      });
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const getCourierGenerateReport = createAsyncThunk(
  "CourierService/getCourierGenerateReportasync",
  async (payload) => {
    // console.log("payload..", payload);
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_GET_COURIER_REPORT.DATA, {
        encryptedData: encryptPayload,
      });
      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchMissingAWBRecords = createAsyncThunk(
  "CourierService/fetchMissingAWBRecords",
  async ({ daysInterval }, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(daysInterval);
      const response = await axiosInstance.get(API_MISSING_AWB_RECORDS.DATA, {
        encryptPayload, // Send daysInterval as a query parameter
      });

      // return response.data;
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      console.error("Error fetching missing AWB records:", error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const CourierSevicesSlice = createSlice({
  name: "CourierService",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(bulkUploadFile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(bulkUploadFile.fulfilled, (state, action) => {
        state.bulkUploadOutward = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(bulkUploadFile.rejected, (state, action) => {
        state.bulkUploadOutward = [];
        state.status = "failed";
      })
      .addCase(bulkUploadFileInward.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(bulkUploadFileInward.fulfilled, (state, action) => {
        state.bulkUploadInward = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(bulkUploadFileInward.rejected, (state, action) => {
        state.bulkUploadInward = [];
        state.status = "failed";
      })
      .addCase(updateInwardCourier.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateInwardCourier.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateInwardCourier.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateOutwardCourier.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateOutwardCourier.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateOutwardCourier.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getInwardCourierData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getInwardCourierData.fulfilled, (state, action) => {
        state.inwardGetDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getInwardCourierData.rejected, (state, action) => {
        state.inwardGetDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertInwardCourier.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertInwardCourier.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertInwardCourier.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getTypeOfCourierDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTypeOfCourierDropdown.fulfilled, (state, action) => {
        state.typeOfCourierDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTypeOfCourierDropdown.rejected, (state, action) => {
        state.typeOfCourierDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getDepartmentDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getDepartmentDropdown.fulfilled, (state, action) => {
        state.departmentDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getDepartmentDropdown.rejected, (state, action) => {
        state.departmentDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getCourierModeDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCourierModeDropdown.fulfilled, (state, action) => {
        state.courierModeDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCourierModeDropdown.rejected, (state, action) => {
        state.courierModeDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getCourierTypeDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCourierTypeDropdown.fulfilled, (state, action) => {
        state.courierTypeDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCourierTypeDropdown.rejected, (state, action) => {
        state.courierTypeDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getReturnReasonDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReturnReasonDropdown.fulfilled, (state, action) => {
        state.returnReasonDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getReturnReasonDropdown.rejected, (state, action) => {
        state.returnReasonDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getShipperNameDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getShipperNameDropdown.fulfilled, (state, action) => {
        state.shipperNameDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getShipperNameDropdown.rejected, (state, action) => {
        state.shipperNameDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getLocationDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getLocationDropdown.fulfilled, (state, action) => {
        state.locationDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getLocationDropdown.rejected, (state, action) => {
        state.locationDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteInwardCourier.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteInwardCourier.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteInwardCourier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteOutwardCourier.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteOutwardCourier.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteOutwardCourier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getOutwardCourierData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOutwardCourierData.fulfilled, (state, action) => {
        state.outwardGetDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getOutwardCourierData.rejected, (state, action) => {
        state.outwardGetDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getPersonalOfficialDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPersonalOfficialDropdown.fulfilled, (state, action) => {
        state.personalOfficialDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPersonalOfficialDropdown.rejected, (state, action) => {
        state.personalOfficialDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getIntlDomLocDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getIntlDomLocDropdown.fulfilled, (state, action) => {
        state.intlDomLocDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getIntlDomLocDropdown.rejected, (state, action) => {
        state.intlDomLocDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertOutwardCourier.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertOutwardCourier.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertOutwardCourier.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertCourierAccountCode.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertCourierAccountCode.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertCourierAccountCode.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateCourierAccountCode.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateCourierAccountCode.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateCourierAccountCode.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteCourierAccountCode.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteCourierAccountCode.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteCourierAccountCode.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(insertRequestOutwardCourier.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertRequestOutwardCourier.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertRequestOutwardCourier.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getVendorNameDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getVendorNameDropdown.fulfilled, (state, action) => {
        state.vendorNameDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getVendorNameDropdown.rejected, (state, action) => {
        state.vendorNameDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getDestination.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDestination.fulfilled, (state, action) => {
        state.destination = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getDestination.rejected, (state, action) => {
        state.destination = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getReceiverNameDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReceiverNameDropdown.fulfilled, (state, action) => {
        state.receiverNameDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getReceiverNameDropdown.rejected, (state, action) => {
        state.receiverNameDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getCourierStatusDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCourierStatusDropdown.fulfilled, (state, action) => {
        state.courierStatusDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCourierStatusDropdown.rejected, (state, action) => {
        state.courierStatusDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getEmpolyeeName.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmpolyeeName.fulfilled, (state, action) => {
        state.empolyeeName = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getEmpolyeeName.rejected, (state, action) => {
        state.empolyeeName = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getEmpolyeeId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmpolyeeId.fulfilled, (state, action) => {
        state.employeeId = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getEmpolyeeId.rejected, (state, action) => {
        state.employeeId = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(uploadCourierReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadCourierReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reportResponse = action.payload;
        state.error = null;
      })
      .addCase(uploadCourierReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred";
      })
      .addCase(getCompanyDetailsByAccount.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCompanyDetailsByAccount.fulfilled, (state, action) => {
        state.companybyaccount = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCompanyDetailsByAccount.rejected, (state, action) => {
        state.companybyaccount = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(hanldePinCodeUpload.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hanldePinCodeUpload.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reportResponse = action.payload;
        state.error = null;
      })
      .addCase(hanldePinCodeUpload.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred";
      })
      .addCase(hanldePinCodeUpdate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hanldePinCodeUpdate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reportResponse = action.payload;
        state.error = null;
      })
      .addCase(hanldePinCodeUpdate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred";
      })
      .addCase(hanldePinCodeDelete.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hanldePinCodeDelete.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reportResponse = action.payload;
        state.error = null;
      })
      .addCase(hanldePinCodeDelete.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred";
      })
      .addCase(getCourierGenerateReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCourierGenerateReport.fulfilled, (state, action) => {
        state.courierReport = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getCourierGenerateReport.rejected, (state, action) => {
        state.courierReport = [];
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateStatusIntwardCourier.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateStatusIntwardCourier.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateStatusIntwardCourier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getCourierCompanyData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCourierCompanyData.fulfilled, (state, action) => {
        state.getCompanyDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCourierCompanyData.rejected, (state, action) => {
        state.getCompanyDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(fetchMissingAWBRecords.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchMissingAWBRecords.fulfilled, (state, action) => {
        state.missingAWBRecords = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(fetchMissingAWBRecords.rejected, (state, action) => {
        state.missingAWBRecords = [];
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = CourierSevicesSlice.actions;

export default CourierSevicesSlice.reducer;
