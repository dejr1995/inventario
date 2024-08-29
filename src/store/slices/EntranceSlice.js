import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const entrancesAllFetch = createAsyncThunk(
  "entrances/entrancesAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/purchases`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const entranceFetchById = createAsyncThunk(
  "entrances/entranceFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/purchases/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const purchasesAll = createAsyncThunk(
  "entrances/purchasesAll",
  async () => {
    try {
      const response = await axios.get(`${url}/purchases/purchasesAll`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const entrancesCreate = createAsyncThunk(
  "entrances/entrancesCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/purchases/create`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const entrancesEdit = createAsyncThunk(
  "entrances/entrancesEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/purchases/update/${values.purchase_id}`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const entrancesDelete = createAsyncThunk(
  "entrances/entrancesDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/purchases/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchPurchasesByDate = createAsyncThunk(
  'entrances/fetchPurchasesByDate',
  async (dates, { rejectWithValue }) => {
    try {
      const { startDate, endDate } = dates || {};
      
      if (!startDate || !endDate) {
        throw new Error('Las fechas de inicio y fin son necesarias');
      }

      const response = await axios.get(`${url}/purchases/purchasesFetchDate`, {
        params: { startDate, endDate },
      });
      
      console.log('Data received:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const EntranceSlice = createSlice({
  name: "entrances",
  initialState: {
    list: [],
    singleEntrance: null,
    purchases: [],
    status: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(entrancesAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(entrancesAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(entrancesAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(entranceFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(entranceFetchById.fulfilled, (state, action) => {
        state.singleEntrance = action.payload;
        state.status = "success";
      })
      .addCase(entranceFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(purchasesAll.pending, (state) => {
        state.status = "pending";
      })
      .addCase(purchasesAll.fulfilled, (state, action) => {
        state.purchases = action.payload;
        state.status = "success";
      })
      .addCase(purchasesAll.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(entrancesCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(entrancesCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(entrancesCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(entrancesEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(entrancesEdit.fulfilled, (state, action) => {
        const updatedEntrance = state.list.map((entrance) =>
          entrance.purchase_id === action.payload.purchase_id ? action.payload : entrance
        );
        state.list = updatedEntrance;
        state.editStatus = "success";
      })
      .addCase(entrancesEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(entrancesDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(entrancesDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item.purchase_id === action.payload.purchase_id
        );
        state.list = newList;
        state.deleteStatus = "success";
      })
      .addCase(entrancesDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
      .addCase(fetchPurchasesByDate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPurchasesByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchPurchasesByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
