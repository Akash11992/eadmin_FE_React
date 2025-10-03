import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  API_GET_INDUSTRY_TYPES,
  API_GET_EMPLOYEE_COUNT,
  API_GET_COMPANY_TYPE,
  API_GET_COUNTRIES,
  API_GET_STATES,
  API_GET_CITIES,
  API_GET_Designations,
  API_COMPANY_LIST,
  API_GET_DEPARTMENTS,
  API_GET_COMPANY_DETAILS,
  API_CATEGORY_DROPDOWN,
  // API_GET_SUB_CATEGORY_DROPDOWN
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  industryTypeData: [],
  employeeCounts: [],
  companyTypes: [],
  countries: [],
  states: [],
  cities: [],
  designation: [],
  companyList: [],
  departments: [],
  companyDetails: [],
  categorys: [],
  subcategories: [],
  error: null,
};

const encrypt = Encryption();
const decrypt = Decryption();

export const getIndustryTypes = createAsyncThunk(
  "CommonDropdownData/getIndustryTypes",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        API_GET_INDUSTRY_TYPES.DATA,
        encryptPayload
      );
      const decryptResponse = JSON.parse(
        decrypt(response?.data?.encryptedData)
      );
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getEmployeeCount = createAsyncThunk(
  "CommonDropdownData/getEmployeeCount",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        API_GET_EMPLOYEE_COUNT.DATA,
        encryptPayload
      );

      const decryptResponse = JSON.parse(
        decrypt(response?.data?.encryptedData)
      );
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getCompanyType = createAsyncThunk(
  "CommonDropdownData/getCompanyType",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        API_GET_COMPANY_TYPE.DATA,
        encryptPayload
      );

      const decryptResponse = JSON.parse(
        decrypt(response?.data?.encryptedData)
      );
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getDesignations = createAsyncThunk(
  "CommonDropdownData/getDesignations",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        API_GET_Designations.DATA,
        encryptPayload
      );

      const decryptResponse = JSON.parse(
        decrypt(response?.data?.encryptedData)
      );
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getCountries = createAsyncThunk(
  "CommonDropdownData/getCountries",
  async (payload) => {
    const encryptPayload = encrypt(payload);
    const response = await axiosInstance.get(API_GET_COUNTRIES.DATA, {
      encryptPayload,
    });

    const decryptResponse = JSON.parse(decrypt(response?.data?.encryptedData));
    return { data: decryptResponse, statusCode: response.status };
  }
);

export const getStates = createAsyncThunk(
  "CommonDropdownData/getStates",
  async (countryId) => {
    const encryptPayload = encrypt(countryId);
    const response = await axiosInstance.get(
      `${API_GET_STATES.DATA}${encryptPayload}`
    );

    const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
    return { data: decryptResponse, statusCode: response.status };
  }
);

export const getCities = createAsyncThunk(
  "CommonDropdownData/getCities",
  async ({ countryId, stateId }) => {
    const encryptPayload = encrypt({ countryId, stateId });

    const response = await axiosInstance.post(
      `${API_GET_CITIES.DATA}`,  // ✅ no longer appending to URL
      { encryptedData: encryptPayload } // ✅ Send as body
    );

    const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
    return { data: decryptResponse, statusCode: response.status };
  }
);



// export const getCities = createAsyncThunk(
//   "CommonDropdownData/getCities",
//   async (payload) => {
//     const encryptPayload = encrypt(payload);

//     const response = await axiosInstance.get(API_GET_CITIES.DATA, {
//       encryptedData: encryptPayload,
//     });

//     const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
//     return { data: decryptResponse, statusCode: response.status };
//   }
// );

export const getCompanyList = createAsyncThunk(
  "CommonDropdownData/getCompanyListasync",
  async (payload) => {
    const encryptPayload = encrypt(payload);
    const response = await axiosInstance.post(API_COMPANY_LIST.DATA, {encryptPayload});

    const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
    return decryptResponse;
  }
);
export const getDepartments = createAsyncThunk(
  "CommonDropdownData/getDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_GET_DEPARTMENTS.DATA);

    const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getCompanyDetails = createAsyncThunk(
  "CommonDropdownData/getCompanyDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(API_GET_COMPANY_DETAILS.DATA,{
          encryptPayload,
        }
      );
      const decryptResponse = JSON.parse(decrypt(response?.data?.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
     
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getcategorydropdown = createAsyncThunk(
  "CommonDropdownData/getcategorydropdownasync",
  async (_, { rejectWithValue }) => {
    try {
      // const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_CATEGORY_DROPDOWN.DATA);

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getSubCategorydropdown = createAsyncThunk(
  "CommonDropdownData/getSubCategorydropdownasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt({ categorie_id: payload });
      const response = await axiosInstance.post(API_CATEGORY_DROPDOWN.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
const CommondropdownSlice = createSlice({
  name: "CommonDropdownData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getIndustryTypes.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getIndustryTypes.fulfilled, (state, action) => {
        state.industryTypeData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getIndustryTypes.rejected, (state, action) => {
        state.industryTypeData = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getEmployeeCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmployeeCount.fulfilled, (state, action) => {
        state.employeeCounts = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getEmployeeCount.rejected, (state, action) => {
        state.employeeCounts = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getCompanyType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompanyType.fulfilled, (state, action) => {
        state.companyTypes = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCompanyType.rejected, (state, action) => {
        state.companyTypes = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getCountries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getCountries.rejected, (state, action) => {
        state.countries = [];
        state.error = action.error.message;
        state.status = "failed";
      })

      .addCase(getStates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStates.fulfilled, (state, action) => {
        state.states = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getStates.rejected, (state, action) => {
        state.states = [];
        state.error = action.error.message;
        state.error = "failed";
      })
      .addCase(getCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.cities = action.payload;
        state.error = null;
        state.error = "succeeded";
      })
      .addCase(getCities.rejected, (state, action) => {
        state.cities = [];
        state.error = action.error.message;
        state.error = "failed";
      })
      .addCase(getDesignations.pending, (state) => {
        state.error = "loading";
      })
      .addCase(getDesignations.fulfilled, (state, action) => {
        state.designation = action.payload;
        state.error = null;
        state.error = "succeeded";
      })
      .addCase(getDesignations.rejected, (state, action) => {
        state.designation = [];
        state.error = action.error.message;
        state.error = "failed";
      })
      .addCase(getCompanyList.pending, (state) => {
        state.error = "loading";
      })
      .addCase(getCompanyList.fulfilled, (state, action) => {
        state.companyList = action.payload;
        state.error = null;
        state.error = "succeeded";
      })
      .addCase(getCompanyList.rejected, (state, action) => {
        state.companyList = [];
        state.error = action.error.message;
        state.error = "failed";
      })
      .addCase(getDepartments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
        state.error = null;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch departments";
        state.departments = [];
      })
      .addCase(getCompanyDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompanyDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companyDetails = action.payload;
        state.error = null;
      })
      .addCase(getCompanyDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch companyDetails";
        state.companyDetails = [];
      })
      .addCase(getcategorydropdown.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getcategorydropdown.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categorys = action.payload;
        state.error = null;
      })
      .addCase(getcategorydropdown.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch categorys";
        state.categorys = [];
      })
      .addCase(getSubCategorydropdown.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubCategorydropdown.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subcategories = action.payload;
        state.error = null;
      })
      .addCase(getSubCategorydropdown.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch subcategories";
        state.subcategories = [];
      });
  },
});

export const {} = CommondropdownSlice.actions;

export default CommondropdownSlice.reducer;