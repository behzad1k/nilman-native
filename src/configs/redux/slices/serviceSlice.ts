import { serviceService } from '@/src/services/ServiceService';
import { extractChildren } from '@/src/utils/funs';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import globalType from '@/src/types/globalType';

interface serviceState {
  services: globalType.Service[];
  allServices: globalType.Service[];
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
export const fetchServices = createAsyncThunk('services/fetchServices', serviceService.getAllServices);

const serviceSlice = createSlice({
  name: 'serviceSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      console.log(action.payload);
      if (action.payload.code == 200) {
        const sortedData: globalType.Service[] = [];

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
      state.error = action.payload as string
    });

  },
});


export default serviceSlice.reducer
