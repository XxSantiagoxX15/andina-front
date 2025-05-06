import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private selectedStock = new BehaviorSubject<string>('AMZN');
  selectedStock$ = this.selectedStock.asObservable();

  setSelectedStock(symbol: string) {
    this.selectedStock.next(symbol);
  }
}
