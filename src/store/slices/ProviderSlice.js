import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const providersAllFetch = createAsyncThunk(
  "providers/providersAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/providers`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const providerFetchById = createAsyncThunk(
  "providers/providerFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/providers/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const providersCreate = createAsyncThunk(
  "providers/providersCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/providers/create`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const providersEdit = createAsyncThunk(
  "providers/providersEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/providers/update/${values.provider_id}`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const providersDelete = createAsyncThunk(
  "providers/providersDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/providers/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const ProviderSlice = createSlice({
  name: "providers",
  initialState: {
    list: [],
    singleProvider: null,
    status: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(providersAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(providersAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(providersAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(providerFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(providerFetchById.fulfilled, (state, action) => {
        state.singleProvider = action.payload;
        state.status = "success";
      })
      .addCase(providerFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(providersCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(providersCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(providersCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(providersEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(providersEdit.fulfilled, (state, action) => {
        const updatedProvider = state.list.map((provider) =>
          provider.provider_id === action.payload.provider_id ? action.payload : provider
        );
        state.list = updatedProvider;
        state.editStatus = "success";
      })
      .addCase(providersEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(providersDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(providersDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item._id === action.payload._id
        );
        state.list = newList;
        state.deleteStatus = "success";
      })
      .addCase(providersDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
  },
});
