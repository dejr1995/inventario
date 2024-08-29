import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const billingsAllFetch = createAsyncThunk(
  "billings/billingsAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/billings`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const billingFetchById = createAsyncThunk(
  "billings/billingFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/billings/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const billingsCreate = createAsyncThunk(
  "billings/billingsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/billings/create`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const billingFetchByIdBilling = createAsyncThunk(
  "billings/billingFetchByIdBilling",
  async () => {
    try {
      const response = await axios.get(`${url}/billings/billingsXfacturas`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const billingsXfacturasById = createAsyncThunk(
  "billings/billingsXfacturasById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/billings/billingsXfacturas/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const billingsEdit = createAsyncThunk(
  "billings/billingsEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/billings/updateamount/${values.billing_id}`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const clientsFetchByBilling = createAsyncThunk(
  "billings/clientsFetchByBilling",
  async () => {
    try {
      const response = await axios.get(`${url}/billings/clientsXbillings`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchBillingsByDate = createAsyncThunk(
  'billings/fetchBillingsByDate',
  async (dates, { rejectWithValue }) => {
    try {
      const { startDate, endDate } = dates || {};
      
      if (!startDate || !endDate) {
        throw new Error('Las fechas de inicio y fin son necesarias');
      }

      const response = await axios.get(`${url}/billings/billingsFetchDate`, {
        params: { startDate, endDate },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const BillingSlice = createSlice({
  name: "billings",
  initialState: {
    list: [],
    singleBilling: null,
    billings: [],
    singleBillingXfactura: null,
    clientsx: [],
    status: null,
    deleteStatus: null,
    createdBillingId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(billingsAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(billingsAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(billingsAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(billingFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(billingFetchById.fulfilled, (state, action) => {
        state.singleBilling = action.payload;
        state.status = "success";
      })
      .addCase(billingFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(billingsCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(billingsCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
        state.createdBillingId = action.payload.id;
      })
      .addCase(billingsCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(billingFetchByIdBilling.pending, (state) => {
        state.status = "pending";
      })
      .addCase(billingFetchByIdBilling.fulfilled, (state, action) => {
        state.billings = action.payload;
        state.status = "success";
      })
      .addCase(billingFetchByIdBilling.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(billingsXfacturasById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(billingsXfacturasById.fulfilled, (state, action) => {
        state.singleBillingXfactura = action.payload;
        state.status = "success";
      })
      .addCase(billingsXfacturasById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(billingsEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(billingsEdit.fulfilled, (state, action) => {
        const updatedBilling = state.list.map((billing) =>
          billing.billing_id === action.payload.billing_id ? action.payload : billing
        );
        state.list = updatedBilling;
        state.editStatus = "success";
      })
      .addCase(billingsEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(clientsFetchByBilling.pending, (state) => {
        state.status = "pending";
      })
      .addCase(clientsFetchByBilling.fulfilled, (state, action) => {
        state.clientsx = action.payload;
        state.status = "success";
      })
      .addCase(clientsFetchByBilling.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(fetchBillingsByDate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBillingsByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchBillingsByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
