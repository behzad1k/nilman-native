import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Order } from '@/src/features/order/types'
import { services } from '@/src/configs/services';

interface IOrderSlice {
  orders: Order[]
  cart: Order[]
  lastSync: string | null
  loading: boolean
  error: string | null
}

const initialState: IOrderSlice = {
  orders: [],
  cart: [],
  lastSync: null,
  loading: false,
  error: null,
};

export const order = createAsyncThunk('order/fetchOrders', async () => {
  return await services.order.getOrders();
});

export const cart = createAsyncThunk('order/fetchCart', async () => {
  return await services.cart.getCart();
});

const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(order.fulfilled, (state, action) => {
      state.orders = action.payload.data;
      state.loading = false
      state.error = null
    })
    .addCase(cart.fulfilled, (state, action) => {
      state.cart = action.payload.data;
      state.loading = false
      state.error = null
    });
  },
});

export const { setOrders } = orderSlice.actions;

export default orderSlice.reducer;
