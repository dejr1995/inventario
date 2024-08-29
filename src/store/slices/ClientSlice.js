import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const clientsAllFetch = createAsyncThunk(
  "clients/clientsAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/clients`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const clientFetchById = createAsyncThunk(
  "clients/clientFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/clients/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const clientsXusers = createAsyncThunk(
  "clients/clientsXusers",
  async () => {
    try {
      const response = await axios.get(`${url}/clients/clientsXusers`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const clientsCreate = createAsyncThunk(
  "clients/clientsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/clients/create`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const clientsEdit = createAsyncThunk(
  "clients/clientsEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/clients/update/${values.client_id}`, 
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const clientsDelete = createAsyncThunk(
  "clients/clientsDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/clients/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const ClientSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
    singleClient: null,
    listcxu: [],
    status: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(clientsAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(clientsAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(clientsAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(clientFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(clientFetchById.fulfilled, (state, action) => {
        state.singleClient = action.payload;
        state.status = "success";
      })
      .addCase(clientFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(clientsXusers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(clientsXusers.fulfilled, (state, action) => {
        state.listcxu = action.payload;
        state.status = "success";
      })
      .addCase(clientsXusers.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(clientsCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(clientsCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(clientsCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(clientsEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(clientsEdit.fulfilled, (state, action) => {
        const updatedClient = state.list.map((client) =>
          client.client_id === action.payload.client_id ? action.payload : client
        );
        state.list = updatedClient;
        state.editStatus = "success";
      })
      .addCase(clientsEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(clientsDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(clientsDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item.id === action.payload.id
        );
        state.list = newList;
        state.deleteStatus = "success";
      })
      .addCase(clientsDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
  },
});
