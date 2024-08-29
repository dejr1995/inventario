import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "../api";

export const existsAllFetch = createAsyncThunk(
  "exists/existsAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/sales`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const existFetchById = createAsyncThunk(
  "exists/existFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/sales/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const existsCreate = createAsyncThunk(
  "exists/existsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/sales/create`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const existFetchByIdFactura = createAsyncThunk(
  "exists/existFetchByIdFactura",
  async (id) => {
    try {
      const response = await axios.get(`${url}/sales/salesXfacturas/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const existDelete = createAsyncThunk(
  "exists/existDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/sales/${id}`, setHeaders()
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchSalesByDate = createAsyncThunk(
  'exists/fetchSalesByDate',
  async (dates, { rejectWithValue }) => {
    try {
      const { startDate, endDate } = dates || {};
      
      if (!startDate || !endDate) {
        throw new Error('Las fechas de inicio y fin son necesarias');
      }

      const response = await axios.get(`${url}/sales/salesFetchDate`, {
        params: { startDate, endDate },
      });
      
      console.log('Data received:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ExistSlice = createSlice({
  name: "exists",
  initialState: {
    list: [],
    singleExist: null,
    facturas: [],
    status: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(existsAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(existsAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(existsAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(existFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(existFetchById.fulfilled, (state, action) => {
        state.singleExist = action.payload;
        state.status = "success";
      })
      .addCase(existFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(existsCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(existsCreate.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(existsCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(existFetchByIdFactura.pending, (state) => {
        state.status = "pending";
      })
      .addCase(existFetchByIdFactura.fulfilled, (state, action) => {
        state.facturas = action.payload;
        state.status = "success";
      })
      .addCase(existFetchByIdFactura.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(existDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(existDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item.sale_id !== action.payload.sale_id
        );
        state.list = newList;
        state.deleteStatus = "success";
      })      
      .addCase(existDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
      .addCase(fetchSalesByDate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalesByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchSalesByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
