import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "../api";

export const businessAllFetch = createAsyncThunk(
  "business/businessAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/business`, setHeaders());
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const businessFetchById = createAsyncThunk(
  "business/businessFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/business/find/${id}`, setHeaders());
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const businessCreate = createAsyncThunk(
  "business/businessCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/business/create`,
        values, setHeaders()
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const businessEdit = createAsyncThunk(
  "business/businessEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/business/update/${values.business_id}`,
        values,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);


export const businesslice = createSlice({
  name: "business",
  initialState: {
    list: [],
    singleBusiness: null,
    status: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(businessAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(businessAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(businessAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(businessFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(businessFetchById.fulfilled, (state, action) => {
        state.singleBusiness = action.payload;
        state.status = "success";
      })
      .addCase(businessFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(businessCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(businessCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(businessCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(businessEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(businessEdit.fulfilled, (state, action) => {
        const updatedBusiness = state.list.map((business) =>
          business.business_id === action.payload.business_id ? action.payload : business
        );
        state.list = updatedBusiness;
        state.editStatus = "success";
      })
      .addCase(businessEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
  },
});
