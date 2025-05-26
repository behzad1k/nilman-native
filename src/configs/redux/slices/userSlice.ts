import { userService } from '@/src/services/userService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
}

interface UserState {
  profile: User | null
  lastSync: string | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  lastSync: null,
  loading: false,
  error: null,
}

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  userService.getCurrentUser
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.profile = action.payload
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
      state.profile = action.payload
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
