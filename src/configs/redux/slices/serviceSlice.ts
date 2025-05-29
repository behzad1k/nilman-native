import { ServiceService } from '@/src/features/service/services/ServiceService';
import { Service } from '@/src/features/service/serviceTypes';
import { extractChildren, getServiceIcon } from '@/src/utils/funs';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface serviceState {
  services: Service[];
  allServices: Service[];
  lastSync: string | null
  loading: boolean
  error: string | null
}

const initialState: serviceState = {
  allServices: [],
  services: [],
  lastSync: null,
  loading: false,
  error: null,
};
export const fetchServices = createAsyncThunk('services/fetchServices', ServiceService.getAllServices);

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      if (action.payload.code == 200) {
        const sortedData: Service[] = [];

        action.payload.data.map(e => extractChildren(e, sortedData));

        state.allServices = sortedData;
        state.services = action.payload.data;
        state.loading = false
      }
    })
    .addCase(fetchServices.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchServices.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string || 'Fetch Error'
    });

  },
});


export default serviceSlice.reducer
