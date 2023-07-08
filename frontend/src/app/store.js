import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import taskReducer from '../features/tasks/taskSlice'
import adminSlice from '../features/admin/adminSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    users:adminSlice
  },
})