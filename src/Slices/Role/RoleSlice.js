import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_ROLE_TYPE,
  API_CREATE_ROLE,
  API_UPDATE_ROLE,
  API_DELETE_ROLE,
  API_MODULE_NAME,
  API_PAGES_NAME,
  API_PERMISSION_BY_ID_ROLE,
  API_GET_ROLE_COUNT,
  API_GET_COUNTRY_BY_COMPANY_ID,
  API_GET_PERMISSION_BY_ID_DETAILS,
  API_FIND_BY_ID_ROLE,
  API_GET_PAGES_AND_MODULES,
  API_GET_UPDATE_ROLE,
} from "../../Services/ApiConstant";
import axiosInstance from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";
const initialState = {
  getRoleData: [],
  moduleList: [],
  pageList: [],
  roleCount: [],
  getCountry: [],
  permissionDetails: [],
  findDetailData: [],
  pagesAndModules: [],
  updaterole: [],
  error: null,
};

const encrypt = Encryption();
const decrypt = Decryption();

// get role function code here ....
export const getRoleTypes = createAsyncThunk(
  "Role/getRoleTypes",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(API_ROLE_TYPE.DATA, {
        encryptedData: encryptPayload,
      });

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// create role function code here ....
export const createRole = createAsyncThunk(
  "Role/createRoleasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_CREATE_ROLE.DATA, payload);
      console.log("data response...", response);
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

// update role function code here ....
export const updateRole = createAsyncThunk(
  "Role/updateRoleasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_UPDATE_ROLE.DATA, payload);
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

// delete role function code here ....
export const deleteRole = createAsyncThunk(
  "Role/deleteRoleasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_DELETE_ROLE.DATA, payload);
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      const message =
        error.response?.data?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

// get module list in role function code here ....
export const getModuleList = createAsyncThunk(
  "Role/getModuleList",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(API_MODULE_NAME.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// get page list in role function code here ....
export const getPageList = createAsyncThunk(
  "Role/getPageList",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_PAGES_NAME.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// get permission by id in role function code here ....
export const getPermissionById = createAsyncThunk(
  "Role/getPermissionByIdasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_PERMISSION_BY_ID_ROLE.DATA,
        { encryptedData: encryptPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// get role function code here ....
export const getRoleCount = createAsyncThunk(
  "Role/getRoleCountasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_GET_ROLE_COUNT.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// get company by id function code here ....
export const getcontryById = createAsyncThunk(
  "Role/getcontryByIdasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_COUNTRY_BY_COMPANY_ID.DATA,
        { encryptedData: encryptPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// get company by id function code here ....
export const getPermissionByIdDetails = createAsyncThunk(
  "Role/getPermissionByIdDetailsasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);

      const response = await axiosInstance.post(
        API_GET_PERMISSION_BY_ID_DETAILS.DATA,
        { encryptedData: encryptPayload }
      );

      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getpagesAndModules = createAsyncThunk(
  "Role/getpagesAndModules",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_PAGES_AND_MODULES.DATA,
        { encryptedData: encryptPayload }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const getUpdateRole = createAsyncThunk(
  "Role/getUpdateRole",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.put(API_GET_UPDATE_ROLE.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

// get details by id function code here ....
export const getFetchByIdDetails = createAsyncThunk(
  "Role/getFetchnByIdDetailsasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_FIND_BY_ID_ROLE.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

const RoleSlice = createSlice({
  name: "Role",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getRoleTypes.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getRoleTypes.fulfilled, (state, action) => {
        state.getRoleData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getRoleTypes.rejected, (state, action) => {
        state.getRoleData = [];
        state.status = "failed";
      })
      .addCase(createRole.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(createRole.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateRole.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(deleteRole.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getModuleList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getModuleList.fulfilled, (state, action) => {
        state.moduleList = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getModuleList.rejected, (state, action) => {
        state.moduleList = [];
        state.status = "failed";
      })
      .addCase(getPageList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPageList.fulfilled, (state, action) => {
        state.pageList = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPageList.rejected, (state, action) => {
        state.pageList = [];
        // state.error = action.payload ? action.payload.message : action.error.message;
        state.status = "failed";
      })
      .addCase(getPermissionById.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPermissionById.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPermissionById.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getRoleCount.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getRoleCount.fulfilled, (state, action) => {
        // state.roleCount = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getRoleCount.rejected, (state, action) => {
        // state.roleCount = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getcontryById.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getcontryById.fulfilled, (state, action) => {
        state.getCountry = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getcontryById.rejected, (state, action) => {
        state.getCountry = [];
        state.error = action.error.message;
        state.status = "failed";
      })

      .addCase(getPermissionByIdDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPermissionByIdDetails.fulfilled, (state, action) => {
        state.permissionDetails = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getPermissionByIdDetails.rejected, (state, action) => {
        state.permissionDetails = [];
        state.error = action.error.message;
        state.status = "failed";
      })

      .addCase(getFetchByIdDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFetchByIdDetails.fulfilled, (state, action) => {
        state.findDetailData = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getFetchByIdDetails.rejected, (state, action) => {
        state.findDetailData = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getpagesAndModules.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getpagesAndModules.fulfilled, (state, action) => {
        // state.pagesAndModules = action.payload
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getpagesAndModules.rejected, (state, action) => {
        // state.pagesAndModules = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getUpdateRole.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUpdateRole.fulfilled, (state, action) => {
        // state.UpdateRole = action.payload
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getUpdateRole.rejected, (state, action) => {
        // state.UpdateRole = [];
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const {} = RoleSlice.actions;

export default RoleSlice.reducer;
