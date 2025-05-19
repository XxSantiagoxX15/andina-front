import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StockState } from './stock.reducer';

export const selectStockState = createFeatureSelector<StockState>('stock');

export const selectSelectedSymbol = createSelector(
  selectStockState,
  (state: StockState) => state.selectedSymbol
); 