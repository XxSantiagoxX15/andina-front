import { createReducer, on } from '@ngrx/store';
import { setSelectedStock } from './stock.actions';

export interface StockState {
  selectedSymbol: string;
}

export const initialState: StockState = {
  selectedSymbol: 'AAPL'
};

export const stockReducer = createReducer(
  initialState,
  on(setSelectedStock, (state, { symbol }) => ({
    ...state,
    selectedSymbol: symbol
  }))
); 