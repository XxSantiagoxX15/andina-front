import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { StockService } from '../../services/stock.service';
import { selectSelectedSymbol } from '../../store/stock/stock.selectors';

export interface Order {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  quantity: number;
  total: number;
  date: string;
}

@Component({
  selector: 'app-trading-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trading-actions.component.html',
  styleUrls: ['./trading-actions.component.css']
})
export class TradingActionsComponent implements OnInit {
  showOrderTicket = false;
  orderType: 'BUY' | 'SELL' = 'BUY';
  currentSymbol = 'AAPL';
  currentPrice = 150.00;
  quantity = 1;
  orders: Order[] = [];
  isComisionista: boolean = true;

  constructor(
    private stockService: StockService,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.store.select(selectSelectedSymbol).subscribe(symbol => {
      this.currentSymbol = symbol;
      // Aquí podrías actualizar el precio actual basado en el símbolo
    });
    this.loadOrders();
  }

  onBuyClick() {
    this.orderType = 'BUY';
    this.showOrderTicket = true;
  }

  onSellClick() {
    this.orderType = 'SELL';
    this.showOrderTicket = true;
  }

  onAcceptOrder() {
    const order: Order = {
      id: this.generateId(),
      type: this.orderType,
      symbol: this.currentSymbol,
      price: this.currentPrice,
      quantity: this.quantity,
      total: this.currentPrice * this.quantity,
      date: new Date().toLocaleString()
    };
    this.orders.unshift(order);
    this.saveOrders();
    this.showOrderTicket = false;
    this.quantity = 1;
  }

  deleteOrder(id: string) {
    this.orders = this.orders.filter(order => order.id !== id);
    this.saveOrders();
  }

  loadOrders() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('orders');

      this.orders = data ? JSON.parse(data) : [];
    }
  }

  saveOrders() {
      localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 10) + Date.now();
  }


  showCommentPopup = false;
  comentario = '';

  openCommentPopup() {
    this.showCommentPopup = true;
  }

  closeCommentPopup() {
    this.showCommentPopup = false;
  }

  submitComment() {
    console.log('Comentario enviado:', this.comentario);
    // Aquí podrías hacer algo como enviar a un backend o mostrar en pantalla
    this.closeCommentPopup();
  }

}
