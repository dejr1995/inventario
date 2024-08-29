import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "../api";

export const rolesAllFetch = createAsyncThunk(
  "roles/rolesAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/roles`, setHeaders());
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const roleFetchById = createAsyncThunk(
  "roles/roleFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/roles/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const rolesCreate = createAsyncThunk(
  "roles/rolesCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/roles/create`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const rolesEdit = createAsyncThunk(
  "roles/rolesEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/roles/update/${values.role_id}`, 
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error; 
    }
  }
);


export const rolesDelete = createAsyncThunk(
  "roles/rolesDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/roles/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const RoleSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    singleRole: null,
    status: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(rolesAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(rolesAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(rolesAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(roleFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(roleFetchById.fulfilled, (state, action) => {
        state.singleRole = action.payload;
        state.status = "success";
      })
      .addCase(roleFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(rolesCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(rolesCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(rolesCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(rolesEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(rolesEdit.fulfilled, (state, action) => {
        const updatedRoles = state.list.map((role) =>
          role.role_id === action.payload.role_id ? action.payload : role
        );
        state.list = updatedRoles;
        state.editStatus = "success";
      })
      .addCase(rolesEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(rolesDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(rolesDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item.role_id === action.payload.role_id
        );
        state.list = newList;
        state.deleteStatus = "success";
      })
      .addCase(rolesDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
  },
});
