import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_GET_DROPDOWN_DETAILS,
  API_OLA_UBER_FILE_UPLOAD,
  API_GET_OLA_UBER_FILESUMMARY,
  API_GET_OLA_UBER_FILE_DETAILS,
  API_DELETE_OLA_UBER_UPLOAD_FILE,
  API_INSERT_TRAVELREQUEST,
  API_GET_TRAVEL_DETAILS_BY_USER_ID,
  API_GET_TRAVEL_DETAILS_BY_Id,
  API_INSERT_VENDOR_DETAILS,
  API_TRAVELBOOK_BOOK_VENDOR,
  API_OLA_UBER_MAIL_DETAILS,
  API_UPDATE_OLA_UBER_MAIL_DETAILS,
  API_GET_MAPPED_ID,
  API_EMP_DROPDOWN,
  API_ADD_PREREFERENCES,
  API_GET_PREREFERENCES_DETAILS,
  API_GET_VENDORNAME_DETAILS,
  API_GET_RM_DETAILS,
  API_GET_DEPARTMENT_SUBDEPARTMENT,
  API_OLA_UBER_AMOUNT,
  API_GET_TRAVEL_REPORT_TYPE_DROPDOWN,
  API_FINAL_HOD_APPROVAL,
  API_INSERT_INVOICE_DETAILS,
  API_GET_INVOICE_DETAILS,
  API_DELETE_INVOICE_DETAILS,
  API_GET_TRAVEL_RECONCILE_RECORDS,
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  flight_name: [],
  travellerTime: [],
  stops: [],
  travelModeData: [],
  journeyClassData: [],
  vendorNameData: [],
  ola_uber_vendorNameData: [],
  ola_ReportTypeData: [],
  uber_ReportTypeData: [],
  ola_uber_fileUploadData: [],
  olaUberFileSummary: [],
  olaUberFileDetails: [],
  deleteOlaUberUploadedFile: [],
  insertTravelRequestData: [],
  getTravelDetailsByUserId: [],
  getTravelDetaById: null,
  insertVendorDetailsData: [],
  insertTravelRequestBookVenderData: [],
  getEmpDropData: [],
  addPrepreferenceData: [],
  getPrereferencesDetailsData: [],
  vendorDetailsNameData: [],
  getRMDetailsData: [],
  getDepartment_subDepartment: [],
  error: null,
  getOlaUberMailDetails: [],
  mappedId: [],
  olaUberAmount: [],
  reportType: [],
  finalApprovalData: [],
  meal: [],
  carType: [],
  packageData: [],
  reconcileFileDetails: [],
  subDepartment: [],
  reconcileRecord: [],
};
const encrypt = Encryption();
const decrypt = Decryption();

// For Flight Name
export const getFlightName = createAsyncThunk(
  "TravelManagement/getFlightNameasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
// For TravellerTime
export const getTravellerTime = createAsyncThunk(
  "TravelManagement/getTravellerTimeasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// For TravelType
export const getStops = createAsyncThunk(
  "TravelManagement/getStopsasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// For TravelType
export const getTravelMode = createAsyncThunk(
  "TravelManagement/getTravelModeasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// For JourneyClass
export const getJourneyClass = createAsyncThunk(
  "TravelManagement/getJourneyClassasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
// For VendorName
export const getVendorName = createAsyncThunk(
  "TravelManagement/getVendorNameasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
// Ola uber vendor name
export const get_ola_uber_VendorName = createAsyncThunk(
  "TravelManagement/get_ola_uber_VendorNameasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const get_ola_ReportType = createAsyncThunk(
  "TravelManagement/get_ola_ReportTypeasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
// Upload ola uber file
export const upload_ola_uber_File = createAsyncThunk(
  "TravelManagement/upload_ola_uber_Fileasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_OLA_UBER_FILE_UPLOAD.DATA,
        payload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      // throw error;
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const ola_Uber_File_Summary = createAsyncThunk(
  "TravelManagement/ola_Uber_File_Summaryasync",
  async (payload, { rejectWithValue }) => {
    const encryptedPayload = encrypt( payload)
    try {
      const response = await axiosInstance.post(
        API_GET_OLA_UBER_FILESUMMARY.DATA,
        {encryptedData:encryptedPayload}
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);
// Get Ola uber file Details
export const getOla_uber_File_Details = createAsyncThunk(
  "TravelManagement/getOla_uber_File_Detailsasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_OLA_UBER_FILE_DETAILS.DATA,
        {encryptedData:encryptedPayload}
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const deleteOlaUberUploadedFile = createAsyncThunk(
  "TravelManagement/deleteOlaUberUploadedFileAsync",
  async (payload) => {
    const encryptedData = encrypt(payload.sNo)
    try {
      const response = await axiosInstance.delete(
        API_DELETE_OLA_UBER_UPLOAD_FILE.DATA(encryptedData)
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// Insert travel request form

export const insertTravelRequestForm = createAsyncThunk(
  "TravelManagement/insertTravelRequestFormAsync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_INSERT_TRAVELREQUEST.DATA,
        payload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);
export const getTravelDetailsByUser_Id = createAsyncThunk(
  "TravelManagement/getTravelDetailsByUser_IdAsync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_TRAVEL_DETAILS_BY_USER_ID.DATA,
        { encryptedData: encryptedPayload }
      );

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);
// Insert vendor details
export const insert_vendor_details = createAsyncThunk(
  "TravelManagement/insert_vendor_detailsAsync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_INSERT_VENDOR_DETAILS.DATA,
        payload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);

// Get travel Data by id
export const getTravelDetailsDataById = createAsyncThunk(
  "TravelManagement/getTravelDetailsDataByIdAsync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_TRAVEL_DETAILS_BY_Id.DATA,
        { encryptedData: encryptedPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);

// Travel request final booking
export const insertFinalBooking = createAsyncThunk(
  "TravelManagement/insertFinalBookingAsync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_TRAVELBOOK_BOOK_VENDOR.DATA,
        { encryptedData: encryptedPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);

export const getOlaUberMailMapping = createAsyncThunk(
  "AlertTravelManagement/getOlaUberMailMappingasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_OLA_UBER_MAIL_DETAILS.DATA,
        // { encryptedData: encryptedPayload }
        payload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse.data, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);
export const fetchEmpDropDownData = createAsyncThunk(
  "TravelManagement/fetchEmpDropDownDataAsync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.get(API_EMP_DROPDOWN.DATA, { encryptedData: encryptedPayload });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);
// add PreReference..

export const addPrePreference = createAsyncThunk(
  "TravelManagement/addPrePreferenceAsync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_ADD_PREREFERENCES.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// get prereference data

export const getPrereferencesDetails = createAsyncThunk(
  "TravelManagement/getPrereferencesDetailsAsync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_GET_PREREFERENCES_DETAILS.DATA,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// get Vendor name Details
export const fetchVendorNameDetails = createAsyncThunk(
  "TravelManagement/fetchVendorNameDetailsAsync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_VENDORNAME_DETAILS.DATA,
        { encryptedData: encryptedPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);
// Get Reporting manager Datils
export const fetchReportingManagerDetails = createAsyncThunk(
  "TravelManagement/fetchReportingManagerDetailsAsync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_RM_DETAILS.DATA,
        { encryptedData: encryptedPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);
// department sub department

export const fetchDepartment_SubDepartments = createAsyncThunk(
  "TravelManagement/fetchDepartment_SubDepartmentsAsync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_DEPARTMENT_SUBDEPARTMENT.DATA,
        { encryptedData: encryptedPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);

export const fetchsubDepartments = createAsyncThunk(
  "TravelManagement/fetchsubDepartmentsAsync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_DEPARTMENT_SUBDEPARTMENT.DATA,
        { encryptedData: encryptedPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      
      return decryptResponse
    } catch (error) {
      throw error;
    }
  }
);
export const updateOlaUberMailMapping = createAsyncThunk(
  "AlertTravelManagement/updateOlaUberMailMappingasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt( payload)
      const response = await axiosInstance.post(
        API_UPDATE_OLA_UBER_MAIL_DETAILS.DATA,
        {encryptedData:encryptedPayload}
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse.data, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);
export const getMappedId = createAsyncThunk(
  "AlertTravelManagement/getMappedIdasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_MAPPED_ID.DATA,
        {encryptedData:encryptedPayload}
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const getolaUberAmounts = createAsyncThunk(
  "AlertTravelManagement/getolaUberAmountsasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_OLA_UBER_AMOUNT.DATA,
        {encryptedData:encryptedPayload}
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

export const getReportType = createAsyncThunk(
  "AlertTravelManagement/getolaTypeasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(
        API_GET_TRAVEL_REPORT_TYPE_DROPDOWN.DATA,
        { encryptedData: encryptedPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      

      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);

// final Approval and cancel

export const finalHodApproval = createAsyncThunk(
  "TravelManagement/finalHodApprovalAsync",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        API_FINAL_HOD_APPROVAL.DATA,
        payload
      );
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      throw error;
    }
  }
);

export const getMeal = createAsyncThunk(
  "TravelManagement/getMealasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const getCarType = createAsyncThunk(
  "TravelManagement/getCarTypeasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getPackage = createAsyncThunk(
  "TravelManagement/getPackageasync",
  async (payload) => {
    try {
      const encryptedPayload = encrypt({ name: payload })
      const response = await axiosInstance.post(API_GET_DROPDOWN_DETAILS.DATA, {
        encryptedData: encryptedPayload
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const insertReconcileTravel = createAsyncThunk(
  "AlertTravelManagement/insertReconcileTravelasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_INSERT_INVOICE_DETAILS.DATA,
        payload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);
export const getReconcileTravelfile = createAsyncThunk(
  "AlertTravelManagement/getReconcileTravelfileasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt({ id: payload })
      const response = await axiosInstance.post(API_GET_INVOICE_DETAILS.DATA, {
        encryptedData: encryptedPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);
export const deleteReconcileTravelfile = createAsyncThunk(
  "AlertTravelManagement/deleteReconcileTravelfileasync",
  async (id, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt(id)
      const response = await axiosInstance.delete(
        API_DELETE_INVOICE_DETAILS.DATA(encryptedPayload)
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data: decryptResponse,
      });
    }
  }
);
// Slices..

export const getReconcileTravelRecords = createAsyncThunk(
  "AlertTravelManagement/getReconcileTravelRecordsasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptedPayload = encrypt(payload)
      const response = await axiosInstance.post(API_GET_TRAVEL_RECONCILE_RECORDS.DATA,
        { encryptedData: encryptedPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData))
      return { data:decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(decrypt(error.response.data.encryptedData))
      return rejectWithValue({
        message: error.message,
        statusCode: error.response?.status,
        data:decryptResponse,
      });
    }
  }
);
const TravelManagementSlice = createSlice({
  name: "TravelManagement",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFlightName.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFlightName.fulfilled, (state, action) => {
        state.flight_name = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getFlightName.rejected, (state, action) => {
        state.flight_name = [];
        state.status = "failed";
      })

      //   Traverller TIme ..
      .addCase(getTravellerTime.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTravellerTime.fulfilled, (state, action) => {
        state.travellerTime = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTravellerTime.rejected, (state, action) => {
        state.travellerTime = [];
        state.status = "failed";
      })
      //  Stops...
      .addCase(getStops.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getStops.fulfilled, (state, action) => {
        state.stops = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getStops.rejected, (state, action) => {
        state.stops = [];
        state.status = "failed";
      })
      //  TravelMode...
      .addCase(getTravelMode.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTravelMode.fulfilled, (state, action) => {
        state.travelModeData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTravelMode.rejected, (state, action) => {
        state.travelModeData = [];
        state.status = "failed";
      })
      //  JourneyClass...
      .addCase(getJourneyClass.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getJourneyClass.fulfilled, (state, action) => {
        state.journeyClassData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getJourneyClass.rejected, (state, action) => {
        state.journeyClassData = [];
        state.status = "failed";
      })
      //  VendorName...
      .addCase(getVendorName.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getVendorName.fulfilled, (state, action) => {
        state.vendorNameData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getVendorName.rejected, (state, action) => {
        state.vendorNameData = [];
        state.status = "failed";
      })
      // ola_uber_vender name
      .addCase(get_ola_uber_VendorName.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(get_ola_uber_VendorName.fulfilled, (state, action) => {
        state.ola_uber_vendorNameData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(get_ola_uber_VendorName.rejected, (state, action) => {
        state.ola_uber_vendorNameData = [];
        state.status = "failed";
      })
      // olaReportType
      .addCase(get_ola_ReportType.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(get_ola_ReportType.fulfilled, (state, action) => {
        state.ola_ReportTypeData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(get_ola_ReportType.rejected, (state, action) => {
        state.ola_ReportTypeData = [];
        state.status = "failed";
      })
      // ola/uber_FileUplaod
      .addCase(upload_ola_uber_File.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(upload_ola_uber_File.fulfilled, (state, action) => {
        state.ola_uber_fileUploadData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(upload_ola_uber_File.rejected, (state, action) => {
        state.ola_uber_fileUploadData = [];
        state.status = "failed";
      })
      // getOlaUberfileSummary
      .addCase(ola_Uber_File_Summary.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(ola_Uber_File_Summary.fulfilled, (state, action) => {
        state.olaUberFileSummary = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(ola_Uber_File_Summary.rejected, (state, action) => {
        state.olaUberFileSummary = [];
        state.status = "failed";
      })
      // Get ola_uber file Details
      .addCase(getOla_uber_File_Details.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOla_uber_File_Details.fulfilled, (state, action) => {
        state.olaUberFileDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getOla_uber_File_Details.rejected, (state, action) => {
        state.olaUberFileDetails = [];
        state.status = "failed";
      })
      // for delete uplaoded ola uber file
      .addCase(deleteOlaUberUploadedFile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteOlaUberUploadedFile.fulfilled, (state, action) => {
        state.deleteOlaUberUploadedFile = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteOlaUberUploadedFile.rejected, (state, action) => {
        state.deleteOlaUberUploadedFile = [];
        state.status = "failed";
      })

      // Insert travel request form

      .addCase(insertTravelRequestForm.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertTravelRequestForm.fulfilled, (state, action) => {
        state.insertTravelRequestData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertTravelRequestForm.rejected, (state, action) => {
        state.insertTravelRequestData = [];
        state.status = "failed";
      })
      // getTravelDetailsByUserID
      .addCase(getTravelDetailsByUser_Id.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTravelDetailsByUser_Id.fulfilled, (state, action) => {
        state.getTravelDetailsByUserId = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getTravelDetailsByUser_Id.rejected, (state, action) => {
        state.getTravelDetailsByUserId = [];
        state.status = "failed";
      })
      // Get travel Details Data by id
      .addCase(getTravelDetailsDataById.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getTravelDetailsDataById.fulfilled, (state, action) => {
        state.getTravelDetaById = action.payload;
        state.status = "succeeded";
      })
      .addCase(getTravelDetailsDataById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Insert vendor details
      .addCase(insert_vendor_details.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insert_vendor_details.fulfilled, (state, action) => {
        state.insertVendorDetailsData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insert_vendor_details.rejected, (state, action) => {
        state.insertVendorDetailsData = [];
        state.status = "failed";
      })
      //inser final booking
      .addCase(insertFinalBooking.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertFinalBooking.fulfilled, (state, action) => {
        state.insertTravelRequestBookVenderData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertFinalBooking.rejected, (state, action) => {
        state.insertTravelRequestBookVenderData = [];
        state.status = "failed";
      })

      // OLA SUMMAY MAIL DETAILS
      .addCase(getOlaUberMailMapping.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOlaUberMailMapping.fulfilled, (state, action) => {
        state.getOlaUberMailDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getOlaUberMailMapping.rejected, (state, action) => {
        state.getOlaUberMailDetails = [];
        state.status = "failed";
      })
      .addCase(updateOlaUberMailMapping.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateOlaUberMailMapping.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateOlaUberMailMapping.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(getMappedId.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getMappedId.fulfilled, (state, action) => {
        state.mappedId = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getMappedId.rejected, (state, action) => {
        state.mappedId = [];
        state.status = "failed";
      })
      // fetch Emp Dropdown
      .addCase(fetchEmpDropDownData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchEmpDropDownData.fulfilled, (state, action) => {
        state.getEmpDropData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(fetchEmpDropDownData.rejected, (state, action) => {
        state.getEmpDropData = [];
        state.status = "failed";
      })
      // Add prereference
      .addCase(addPrePreference.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addPrePreference.fulfilled, (state, action) => {
        state.addPrepreferenceData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(addPrePreference.rejected, (state, action) => {
        state.addPrepreferenceData = [];
        state.status = "failed";
      })
      // get Prerefenrece Details Data
      .addCase(getPrereferencesDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPrereferencesDetails.fulfilled, (state, action) => {
        state.getPrereferencesDetailsData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPrereferencesDetails.rejected, (state, action) => {
        state.getPrereferencesDetailsData = [];
        state.status = "failed";
      })
      // fetch vendor Name Details
      .addCase(fetchVendorNameDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchVendorNameDetails.fulfilled, (state, action) => {
        state.vendorDetailsNameData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(fetchVendorNameDetails.rejected, (state, action) => {
        state.vendorDetailsNameData = [];
        state.status = "failed";
      })
      // fetch reporting manager
      .addCase(fetchReportingManagerDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchReportingManagerDetails.fulfilled, (state, action) => {
        state.getRMDetailsData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(fetchReportingManagerDetails.rejected, (state, action) => {
        state.getRMDetailsData = [];
        state.status = "failed";
      })
      // fech departments and sub department
      .addCase(fetchDepartment_SubDepartments.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchDepartment_SubDepartments.fulfilled, (state, action) => {
        state.getDepartment_subDepartment = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(fetchDepartment_SubDepartments.rejected, (state, action) => {
        state.getDepartment_subDepartment = [];
        state.status = "failed";
      })

      // Final Approval and cancel

      .addCase(finalHodApproval.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(finalHodApproval.fulfilled, (state, action) => {
        state.finalApprovalData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(finalHodApproval.rejected, (state, action) => {
        state.finalApprovalData = [];
        state.status = "failed";
      })

      .addCase(getolaUberAmounts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getolaUberAmounts.fulfilled, (state, action) => {
        state.olaUberAmount = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getolaUberAmounts.rejected, (state, action) => {
        state.olaUberAmount = [];
        state.status = "failed";
      })
      .addCase(getReportType.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReportType.fulfilled, (state, action) => {
        state.reportType = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getReportType.rejected, (state, action) => {
        state.reportType = [];
        state.status = "failed";
      })
      // meal
      .addCase(getMeal.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getMeal.fulfilled, (state, action) => {
        state.meal = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getMeal.rejected, (state, action) => {
        state.meal = [];
        state.status = "failed";
      })
      .addCase(getCarType.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCarType.fulfilled, (state, action) => {
        state.carType = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCarType.rejected, (state, action) => {
        state.carType = [];
        state.status = "failed";
      })
      .addCase(getPackage.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPackage.fulfilled, (state, action) => {
        state.packageData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPackage.rejected, (state, action) => {
        state.packageData = [];
        state.status = "failed";
      })
      .addCase(insertReconcileTravel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertReconcileTravel.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertReconcileTravel.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(getReconcileTravelfile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReconcileTravelfile.fulfilled, (state, action) => {
        state.reconcileFileDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getReconcileTravelfile.rejected, (state, action) => {
        state.reconcileFileDetails = [];
        state.status = "failed";
      })
      .addCase(deleteReconcileTravelfile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteReconcileTravelfile.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteReconcileTravelfile.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(fetchsubDepartments.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchsubDepartments.fulfilled, (state, action) => {
        state.subDepartment = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(fetchsubDepartments.rejected, (state, action) => {
        state.subDepartment = [];
        state.status = "failed";
      })
      .addCase(getReconcileTravelRecords.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReconcileTravelRecords.fulfilled, (state, action) => {
        state.reconcileRecord = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getReconcileTravelRecords.rejected, (state, action) => {
        state.reconcileRecord = [];
        state.status = "failed";
      });
  },
});

export const { } = TravelManagementSlice.actions;

export default TravelManagementSlice.reducer;