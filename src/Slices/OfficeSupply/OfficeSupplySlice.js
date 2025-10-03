import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_GET_OFFICESUPPLY_DROPDOWN,
  API_ADD_OFFICESUPPLY_ITEMS,
  API_GET_OFFICESUPPLY_ITEMLIST,
  API_DELETE_OFFICESUPPLYITEM,
  API_UPDATE_OFFICESUPPLY,
  API__OFFICESUPPLY_REQUEST,
  API_ADD_INVENTORY,
  API_GET_INVENTORY_LIST,
  API_DELETE_INVENTORY,
  API_GET_DROPDOWN_DETAILS,
  API_ADMIN_HELP_DESK_GET_DROPDOWN_DETAILS,
  API__OFFICESUPPLY_GET_DATA,
  API_DELETE_OFFICE_REQ,
  API_GET_OFFICE_SUPPLY_REPORT,
  API_OFFICE_SUPPLY_APPROVER,
  API_OFFICE_SUPPLY_ADD_ITEM,
  API_OFFICE_SUPPLY_BULK_INVENTORY,
  API_OFFICE_SUPPLY_CHECK_STOCK,
} from "../../Services/ApiConstant";
import axiosInstance from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";

const initialState = {
  officesupplice: [],
  officesuppliceItems: [],
  addItems: [],
  getItemList: [],
  deleteOfficeSupply: [],
  updateItem: [],
  RequestSaveData: [],
  createinventory: [],
  getinventorylist: [],
  getUpdatelist: [],
  Deleteinventory: [],
  priorityDropdown: [],
  requestgetData: [],
  locationDropdown: [],
  deleteofficereq: [],
  statusDropdown: [],
  itemCondition: [],
  error: null,
  stock: [],
  report: [],
};
const encrypt = Encryption();
const decrypt = Decryption();

export const officesuppliceCategory = createAsyncThunk(
  "OfficeSupply/officesuppliceCategoryasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_OFFICESUPPLY_DROPDOWN.DATA,
        {
          encryptedData: encryptPayload,
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

export const officesuppliceItem = createAsyncThunk(
  "OfficeSupply/officesuppliceItemasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_OFFICESUPPLY_DROPDOWN.DATA,
        {
          encryptedData: encryptPayload,
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
export const addOfficeSupplyItem = createAsyncThunk(
  "OfficeSupply/addOfficeSupplyItemasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_ADD_OFFICESUPPLY_ITEMS.DATA,
        {
          encryptedData: encryptPayload,
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
export const getOfficeSupplyItemsList = createAsyncThunk(
  "OfficeSupply/getOfficeSupplyItemsListasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_GET_OFFICESUPPLY_ITEMLIST.DATA,
        payload
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
export const deleteOfficeSupplyItem = createAsyncThunk(
  "OfficeSupply/deleteOfficeSupplyItemasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_DELETE_OFFICESUPPLYITEM.DATA,
        {
          encryptedData: encryptPayload,
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
export const updateOfficeSupply = createAsyncThunk(
  "OfficeSupply/updateOfficeSupplyasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_UPDATE_OFFICESUPPLY.DATA, {
        encryptedData: encryptPayload,
      });
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
export const officesupliceRequest = createAsyncThunk(
  "OfficeSupply/officesupliceRequestasync",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API__OFFICESUPPLY_REQUEST.DATA,
        payload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const statusCode = error.response ? error.response.status : 500;
      console.log(error.response, "statusCode");
      const decryptError = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      console.log(decryptError, "decryptError");
      const message = decryptError?.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
export const addinventory = createAsyncThunk(
  "OfficeSupply/addinventoryasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_ADD_INVENTORY.DATA, {
        encryptedData: encryptPayload,
      });
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
export const getinventory = createAsyncThunk(
  "OfficeSupply/getinventoryasync",
  async () => {
    try {
      const response = await axiosInstance.get(API_GET_INVENTORY_LIST.DATA);
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
export const updateinventory = createAsyncThunk(
  "OfficeSupply/updateinventoryasync",
  async (stock_id) => {
    try {
      const encryptPayload = encrypt({ id: stock_id });
      const response = await axiosInstance.get(
        `${API_GET_INVENTORY_LIST.DATA}/?encryptedData=${encryptPayload}`
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error.response?.data || "An unknown error occurred";
    }
  }
);
export const deleteInventoryRecords = createAsyncThunk(
  "OfficeSupply/deleteInventoryRecords",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_DELETE_INVENTORY.DATA, {
        encryptedData: encryptPayload,
      });
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

export const getStock = createAsyncThunk(
  "OfficeSupply/getStock",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_OFFICESUPPLY_DROPDOWN.DATA,
        {
          encryptedData: encryptPayload,
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
export const getPriorityDropdown = createAsyncThunk(
  "OfficeSupply/getPriorityDropdownasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({
        name: payload,
      });

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

export const getBuildingDropdown = createAsyncThunk(
  "OfficeSupply/getBuildingDropdownasync",
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
  "OfficeSupply/getLocationDropdownasync",
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
export const officesupliceRequestgetdata = createAsyncThunk(
  "OfficeSupply/officesupliceRequestgetdataasync",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API__OFFICESUPPLY_GET_DATA.DATA,
        {
          encryptedData: encryptPayload,
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
export const deleteOfficeReq = createAsyncThunk(
  "OfficeSupply/deleteOfficeReq",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(API_DELETE_OFFICE_REQ.DATA, {
        encryptedData: encryptPayload,
      });
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
export const getstatusDropdown = createAsyncThunk(
  "OfficeSupply/getstatusDropdownasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({
        name: payload,
      });
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
export const getItemDropdown = createAsyncThunk(
  "OfficeSupply/getItemDropdownasync",
  async (payload) => {
    try {
      const encryptPayload = encrypt({
        name: payload,
      });
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

export const getReport = createAsyncThunk(
  "OfficeSupply/getReport",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_GET_OFFICE_SUPPLY_REPORT.DATA,
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
      const statusCode = error.response ? error.response.status : 500;
      const message = decryptResponse.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const bulkUploadInventory = createAsyncThunk(
  "OfficeSupply/bulkUploadInventory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_OFFICE_SUPPLY_BULK_INVENTORY.DATA,
        payload
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: decryptResponse, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      const statusCode = error.response ? error.response.status : 500;
      const message = decryptResponse.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const approverApproval = createAsyncThunk(
  "OfficeSupply/approverApproval",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.get(
        `${API_OFFICE_SUPPLY_APPROVER.DATA}?data=${encryptPayload}`
      );
      // const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return { data: response.data, statusCode: response.status };
    } catch (error) {
      const decryptResponse = JSON.parse(
        decrypt(error.response.data.encryptedData)
      );
      const statusCode = error.response ? error.response.status : 500;
      const message = decryptResponse.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);

export const addItem = createAsyncThunk(
  "OfficeSupply/addItem",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_OFFICE_SUPPLY_ADD_ITEM.DATA,
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
      const statusCode = error.response ? error.response.status : 500;
      const message = decryptResponse.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
export const checkStock = createAsyncThunk(
  "OfficeSupply/checkStock",
  async (payload, { rejectWithValue }) => {
    try {
      const encryptPayload = encrypt(payload);
      const response = await axiosInstance.post(
        API_OFFICE_SUPPLY_CHECK_STOCK.DATA,
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
      const statusCode = error.response ? error.response.status : 500;
      const message = decryptResponse.message || "An unknown error occurred.";
      return rejectWithValue({ statusCode, message });
    }
  }
);
const OfficeSupplySlice = createSlice({
  name: "OfficeSupply",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(officesuppliceCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(officesuppliceCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.officesupplice = action.payload;
        state.error = null;
      })
      .addCase(officesuppliceCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(officesuppliceItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(officesuppliceItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.officesuppliceItems = action.payload;
        state.error = null;
      })
      .addCase(officesuppliceItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(addOfficeSupplyItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOfficeSupplyItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addItems = action.payload;
        state.error = null;
      })
      .addCase(addOfficeSupplyItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(getOfficeSupplyItemsList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOfficeSupplyItemsList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.getItemList = action.payload;
        state.error = null;
      })
      .addCase(getOfficeSupplyItemsList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(deleteOfficeSupplyItem.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteOfficeSupplyItem.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteOfficeSupplyItem.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updateOfficeSupply.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateOfficeSupply.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(updateOfficeSupply.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(officesupliceRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(officesupliceRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.RequestSaveData = action.payload;
        state.error = null;
      })
      .addCase(officesupliceRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(addinventory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addinventory.fulfilled, (state, action) => {
        state.createinventory = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addinventory.rejected, (state, action) => {
        state.createinventory = [];
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getinventory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getinventory.fulfilled, (state, action) => {
        state.getinventorylist = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getinventory.rejected, (state, action) => {
        state.getinventorylist = [];
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateinventory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateinventory.fulfilled, (state, action) => {
        state.getUpdatelist = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateinventory.rejected, (state, action) => {
        state.getUpdatelist = [];
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteInventoryRecords.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteInventoryRecords.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteInventoryRecords.rejected, (state, action) => {
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
        state.locationDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getLocationDropdown.rejected, (state, action) => {
        state.locationDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(officesupliceRequestgetdata.pending, (state) => {
        state.status = "loading";
      })
      .addCase(officesupliceRequestgetdata.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requestgetData = action.payload;
        state.error = null;
      })
      .addCase(officesupliceRequestgetdata.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(deleteOfficeReq.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteOfficeReq.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteOfficeReq.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getstatusDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getstatusDropdown.fulfilled, (state, action) => {
        state.statusDropdown = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getstatusDropdown.rejected, (state, action) => {
        state.statusDropdown = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getItemDropdown.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getItemDropdown.fulfilled, (state, action) => {
        state.itemCondition = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getItemDropdown.rejected, (state, action) => {
        state.itemCondition = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getStock.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getStock.fulfilled, (state, action) => {
        state.stock = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getStock.rejected, (state, action) => {
        state.stock = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(getReport.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.report = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(getReport.rejected, (state, action) => {
        state.report = [];
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(addItem.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(addItem.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(checkStock.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(checkStock.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(checkStock.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export default OfficeSupplySlice.reducer;
