import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance,{
  API_INSERT_DOM_DETAILS,
  API_INSERT_INTER_DETAILS,
  API_GETREVERSEPICKUP_DETAILS,
  API_GETREVERSEPICKUPBYID,
  API_DELETEREVERSEPICKUPBYID
} from "../../Services/ApiConstant";
import Encryption from "../../Components/Decryption/Encryption";
import Decryption from "../../Components/Decryption/Decryption";
const initialState = {
  reverseDataDetail:[],
};

const encrypt = Encryption();
const decrypt = Decryption();

export const insertReverse_Dom = createAsyncThunk(
  "ReversePickup/insertReverse_Domasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(
        API_INSERT_DOM_DETAILS.DATA,{
          encryptedData
        }
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const insertReverse_Inter = createAsyncThunk(
  "ReversePickup/insertReverse_Interasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(
        API_INSERT_INTER_DETAILS.DATA,{
          encryptedData
        }
        
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);

export const GetReversePickupDetail = createAsyncThunk(
  "ReversePickup/GetReversePickupDetailasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(
        API_GETREVERSEPICKUP_DETAILS.DATA,{
          encryptedData
        }
      );
    
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const GetReversePickupById = createAsyncThunk(
  "ReversePickup/GetReversePickupByIdasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(
        API_GETREVERSEPICKUPBYID.DATA,
        {encryptedData}
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const deleteReversePickupById = createAsyncThunk(
  "ReversePickup/deleteReversePickupByIdasync",
  async (payload) => {
    try {
      const encryptedData = encrypt(payload);
      const response = await axiosInstance.post(
        API_DELETEREVERSEPICKUPBYID.DATA,
        {encryptedData}
      );
      const decryptResponse = JSON.parse(decrypt(response.data.encryptedData));
      return decryptResponse;
    } catch (error) {
      throw error;
    }
  }
);
const ReversePickupSlice = createSlice({
  name: "ReversePickup",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(insertReverse_Dom.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertReverse_Dom.fulfilled, (state, action) => {
        state.reverseDataDetail = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertReverse_Dom.rejected, (state, action) => {
        state.reverseDataDetail = [];
        state.status = "failed";
      })
      .addCase(insertReverse_Inter.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(insertReverse_Inter.fulfilled, (state, action) => {
        state.reverseDataDetail = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(insertReverse_Inter.rejected, (state, action) => {
        state.reverseDataDetail = [];
        state.status = "failed";
      })
      .addCase(GetReversePickupDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(GetReversePickupDetail.fulfilled, (state, action) => {
        state.reverseDataDetail = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(GetReversePickupDetail.rejected, (state, action) => {
        state.reverseDataDetail = [];
        state.status = "failed";
      })
      .addCase(GetReversePickupById.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(GetReversePickupById.fulfilled, (state, action) => {
        state.reverseDataDetail = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(GetReversePickupById.rejected, (state, action) => {
        state.reverseDataDetail = [];
        state.status = "failed";
      })
      .addCase(deleteReversePickupById.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteReversePickupById.fulfilled, (state, action) => {
        state.reverseDataDetail = action.payload;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(deleteReversePickupById.rejected, (state, action) => {
        state.reverseDataDetail = [];
        state.status = "failed";
      })
  },
});

export const {} = ReversePickupSlice.actions;

export default ReversePickupSlice.reducer;