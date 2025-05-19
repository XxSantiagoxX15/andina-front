import { createAction, props } from '@ngrx/store';

export const setSelectedStock = createAction(
  '[Stock] Set Selected Stock',
  props<{ symbol: string }>()
); 