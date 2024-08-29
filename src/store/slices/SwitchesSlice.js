// features/switches/switchesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from '../api';

export const fetchSwitches = createAsyncThunk(
  "switches/fetchSwitches",
  async ({permissionId}) => {
    try {
      const response = await axios.get(`${url}/permissions/switches/${permissionId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateSwitches = createAsyncThunk(
  "switches/updateSwitches",
  async ({permissionId,switchStates}) => {
    try {
       await axios.put(
        `${url}/permissions/switches/${permissionId}`,
        switchStates,
      );
      return switchStates;
    } catch (error) {
      console.log(error);
    }
  }
);

export const switchesCreate = createAsyncThunk(
  "switches/switchesCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/switches`,
        values
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const SwitchesSlice = createSlice({
  name: 'switches',
  initialState:{
    switches: {},
    status: 'idle',
    error: null,   
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSwitches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSwitches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.switches = action.payload;
      })
      .addCase(fetchSwitches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateSwitches.fulfilled, (state, action) => {
        state.switches = { ...state.switches, ...action.payload };
      })
      .addCase(switchesCreate.pending, (state) => {
        state.status = "pending";
      })
      .addCase(switchesCreate.fulfilled, (state, action) => {
        state.switches.push(action.payload);
        state.status = "success";
      })
      .addCase(switchesCreate.rejected, (state) => {
        state.status = "failed";
      })
  },
});
