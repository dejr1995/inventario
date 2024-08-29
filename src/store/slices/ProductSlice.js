import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const productsAllFetch = createAsyncThunk(
  "products/productsAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/products`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productFetchById = createAsyncThunk(
  "products/productFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/products/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productsXcategories = createAsyncThunk(
  "products/productsXcategories",
  async (productId) => {
    try {
      const response = await axios.get(`${url}/products/productsXcategories/${productId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/products/create`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productsEdit = createAsyncThunk(
  "products/productsEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/products/update/${values.product_id}`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productsDelete = createAsyncThunk(
  "products/productsDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchProductsByDate = createAsyncThunk(
  'products/fetchByDate',
  async (dates, { rejectWithValue }) => {
    try {
      const { startDate, endDate } = dates || {};
      
      if (!startDate || !endDate) {
        throw new Error('Las fechas de inicio y fin son necesarias');
      }

      const response = await axios.get(`${url}/products/productsFetchDate`, {
        params: { startDate, endDate },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const ProductSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    singleProduct: null,
    listpxc: [],
    status: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(productsAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(productsAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(productsAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(productFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(productFetchById.fulfilled, (state, action) => {
        state.singleProduct = action.payload;
        state.status = "success";
      })
      .addCase(productFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(productsXcategories.pending, (state) => {
        state.status = "pending";
      })
      .addCase(productsXcategories.fulfilled, (state, action) => {
        state.listpxc = action.payload;
        state.status = "success";
      })
      .addCase(productsXcategories.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(productsCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(productsCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(productsCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(productsEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(productsEdit.fulfilled, (state, action) => {
        const updatedProduct = state.list.map((product) =>
          product.product_id === action.payload.product_id ? action.payload : product
        );
        state.list = updatedProduct;
        state.editStatus = "success";
      })
      .addCase(productsEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(productsDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(productsDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item.product_id  === action.payload.product_id 
        );
        state.list = newList;
        state.deleteStatus = "success";
      })
      .addCase(productsDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
      .addCase(fetchProductsByDate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchProductsByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
