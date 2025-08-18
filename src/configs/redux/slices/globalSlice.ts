import { Color } from '@/src/features/order/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { services } from '@/src/configs/services';

interface globalState {
  colors: Color[]
  setting: any
}

const initialState: globalState = {
  colors: [],
  setting: {}
}

export const fetchColors = createAsyncThunk(
  'global/fetchColors',
  () => services.order.getColors()
)

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchColors.fulfilled, (state, action) => {
      state.colors = action.payload.data
    })
  },
})

export default globalSlice.reducer;
