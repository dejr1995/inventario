import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";

export const usersAllFetch = createAsyncThunk(
  "users/usersAllFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/register/users`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userFetchById = createAsyncThunk(
  "users/userFetchById",
  async (id) => {
    try {
      const response = await axios.get(`${url}/register/users/find/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const usersXroles2 = createAsyncThunk(
  "users/usersXroles2",
  async (id) => {
    try {
      const response = await axios.get(`${url}/register/usersXroles2/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const usersXroles = createAsyncThunk(
  "users/usersXroles",
  async () => {
    try {
      const response = await axios.get(`${url}/register/usersXroles`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const usersCreate = createAsyncThunk(
  "users/usersCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/register`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const usersEdit = createAsyncThunk(
  "users/usersEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/register/update/${values.user_id}`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const usersDelete = createAsyncThunk(
  "users/usersDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/register/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userAdminEdit = createAsyncThunk(
  "users/userAdminEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/register/updateAdmin/${values.user_id}`,
        values,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const UserSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    singleUser: null,
    users: [],
    singleUser2: null,
    status: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(usersAllFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(usersAllFetch.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "success";
      })
      .addCase(usersAllFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(userFetchById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(userFetchById.fulfilled, (state, action) => {
        state.singleUser = action.payload;
        state.status = "success";
      })
      .addCase(userFetchById.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(usersXroles.pending, (state) => {
        state.status = "pending";
      })
      .addCase(usersXroles.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status = "success";
      })
      .addCase(usersXroles.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(usersCreate.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(usersCreate.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(usersCreate.rejected, (state) => {
        state.createStatus = "rejected";
      })
      .addCase(usersEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(usersEdit.fulfilled, (state, action) => {
        const updatedUser = state.list.map((user) =>
          user.user_id === action.payload.user_id ? action.payload : user
        );
        state.list = updatedUser;
        state.editStatus = "success";
      })
      .addCase(usersEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
      .addCase(usersDelete.pending, (state ) => {
        state.deleteStatus = "pending";
      })
      .addCase(usersDelete.fulfilled, (state, action) => {
        const newList = state.list.filter(
          (item) => item._id === action.payload._id
        );
        state.list = newList;
        state.deleteStatus = "success";
      })
      .addCase(usersDelete.rejected, (state) => {
        state.deleteStatus = "rejected";
      })
      .addCase(usersXroles2.pending, (state) => {
        state.status = "pending";
      })
      .addCase(usersXroles2.fulfilled, (state, action) => {
        state.singleUser2 = action.payload;
        state.status = "success";
      })
      .addCase(usersXroles2.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(userAdminEdit.pending, (state) => {
        state.editStatus = "pending";
      })
      .addCase(userAdminEdit.fulfilled, (state, action) => {
        const updatedUser = state.list.map((user) =>
          user.user_id === action.payload.user_id ? action.payload : user
        );
        state.list = updatedUser;
        state.editStatus = "success";
      })
      .addCase(userAdminEdit.rejected, (state) => {
        state.editStatus = "rejected";
      })
  },
});
