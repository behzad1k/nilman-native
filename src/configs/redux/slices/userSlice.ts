import UserService from '@/src/features/user/services/UserService';
import { User } from '@/src/features/user/types';
import { DEFAULT_USER } from '@/src/utils/constants';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Address } from '@/src/features/address/types'
import { services } from '@/src/configs/services';

interface UserState {
  data: User
  addresses: Address[]
  workers: User[]
  lastSync: string | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  data: DEFAULT_USER,
  addresses: [],
  workers: [],
  lastSync: null,
  loading: false,
  error: null,
}

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => await services.user.getCurrentUser()
)

export const addresses = createAsyncThunk(
  'user/fetchAddress',
  async () => await services.address.getAddresses()
);
export const getWorkers = createAsyncThunk(
  'user/fetchWorkers',
  async () => await services.user.getUserWorkers()
  );

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload
      state.loading = false
      state.error = null
    },
    resetAppState: (state) => {
      return { ...initialState }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.data
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    .addCase(addresses.fulfilled, (state, action) => {
      state.loading = false
      state.addresses = action.payload.data
    })
    .addCase(getWorkers.fulfilled, (state, action) => {
      state.loading = false
      state.workers = action.payload.data
    })
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
