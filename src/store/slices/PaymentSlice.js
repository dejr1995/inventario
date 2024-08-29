import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "../api";

export const paymentsAllFetch = createAsyncThunk(
  "payments/paymentsAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/payments`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const paymentsFetchById = createAsyncThunk(
  "payments/paymentsFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/payments/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const paymentsCreate = createAsyncThunk(
  "payments/paymentsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/payments/create`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const paymentsEdit = createAsyncThunk(
  "payments/paymentsEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/payments/update/${values.payment_id}`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const paymentsDelete = createAsyncThunk(
  "payments/paymentsDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/payments/${id}`, setHeaders()
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const paymentXbilling = createAsyncThunk(
  "payments/paymentXbilling",
  async (billingId) => {
    try {
      const response = await axios.get(`${url}/payments/paymentXbilling/${billingId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getLastPayment = createAsyncThunk(
  "payments/getLastPayment",
  async () => {
    try {
      const response = await axios.get(`${url}/payments/getlastpayment`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const clearLastPaymentAsync = createAsyncThunk(
  'payments/clearLastPayment',
  async () => {
    return null; 
  }
);

export const paymentsForBilling = createAsyncThunk(
  "payments/paymentsForBilling",
  async (paymentsId) => {
    try {
      const response = await axios.get(`${url}/payments/paymentsForBilling/${paymentsId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchPaymentsByDate = createAsyncThunk(
  'products/fetchPaymentsByDate',
  async (dates, { rejectWithValue }) => {
    try {
      const { startDate, endDate } = dates || {};
      
      if (!startDate || !endDate) {
        throw new Error('Las fechas de inicio y fin son necesarias');
      }

      const response = await axios.get(`${url}/payments/paymentsFetchDate`, {
        params: { startDate, endDate },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const paymentslice = createSlice({
  name: "payments",
  initialState: {
    list: [],
    singlePayment: null,
    status: null,
    listpxb: [],
    createStatus: null,
    createId: null,
    lastPayment: null,
    editStatus: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(paymentsAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(paymentsAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(paymentsAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(paymentsFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(paymentsFetchById.fulfilled, (state, action) => {
        state.singlePayment = action.payload;
        state.status = "success";
      })
      .addCase(paymentsFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(paymentsCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(paymentsCreate.fulfilled, (state, action) => {
        console.log('Action payload:', action.payload);
        state.list.push(action.payload);
        state.createStatus = "success";
        state.createId = action.payload.id;
      })      
      .addCase(paymentsCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(paymentsEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(paymentsEdit.fulfilled, (state, action) => {
        const updatedPayment = state.list.map((payment) =>
            payment.payment_id === action.payload.payment_id ? action.payload : payment
        );
        state.list = updatedPayment;
        state.editStatus = "success";
      })
      .addCase(paymentsEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(paymentsDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(paymentsDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item.payment_id !== action.payload.payment_id
        );
        state.list = newList;
        state.deleteStatus = "success";
      })
      
      .addCase(paymentsDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
      .addCase(paymentXbilling.pending, (state) => {
        state.status = "pending";
      })
      .addCase(paymentXbilling.fulfilled, (state, action) => {
        state.listpxb = action.payload;
        state.status = "success";
      })
      .addCase(paymentXbilling.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(getLastPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLastPayment.fulfilled, (state, action) => {
        state.lastPayment = action.payload;
        state.status = "succeeded";
      })
      .addCase(getLastPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(clearLastPaymentAsync.fulfilled, (state, action) => {
        state.lastPayment = action.payload; 
      })
      .addCase(paymentsForBilling.pending, (state) => {
        state.status = "pending";
      })
      .addCase(paymentsForBilling.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(paymentsForBilling.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(fetchPaymentsByDate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPaymentsByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchPaymentsByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});
