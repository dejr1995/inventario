import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const categoriesAllFetch = createAsyncThunk(
  "categories/categoriesAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/categories`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const categoryFetchById = createAsyncThunk(
  "categories/categoryFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/categories/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const categoriesCreate = createAsyncThunk(
  "categories/categoriesCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/categories/create`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const categoriesDelete = createAsyncThunk(
  "categories/categoriesDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/categories/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const CategorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    singleCategory: null,
    status: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(categoriesAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(categoriesAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(categoriesAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(categoryFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(categoryFetchById.fulfilled, (state, action) => {
        state.singleCategory = action.payload;
        state.status = "success";
      })
      .addCase(categoryFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(categoriesCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(categoriesCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(categoriesCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(categoriesDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(categoriesDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item.id === action.payload.id
        );
        state.list = newList;
        state.deleteStatus = "success";
      })
      .addCase(categoriesDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
  },
});
