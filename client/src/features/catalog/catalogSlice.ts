import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store.ts'

export interface Product {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
  products: Product[]
}

interface CatalogState {
  categories: Category[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: CatalogState = {
  categories: [],
  status: 'idle',
}

export const fetchCatalog = createAsyncThunk(
  'catalog/fetch',
  async () => {
    const response = await fetch(`${import.meta.env.VITE_CATALOG_API_URL}/api/categories`)
    if (!response.ok) throw new Error(`Catalog request failed with status ${response.status}`)
    return (await response.json()) as Category[]
  },
  {
    condition: (_, { getState }) => (getState() as RootState).catalog.status === 'idle',
  },
)

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.categories = action.payload
      })
      .addCase(fetchCatalog.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default catalogSlice.reducer
