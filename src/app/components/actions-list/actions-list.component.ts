import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setSelectedStock } from '../../store/stock/stock.actions';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { TradingActionsComponent } from '../trading-actions/trading-actions.component';
import { TradingViewComponent } from '../trading-view/trading-view.component';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

@Component({
  selector: 'app-actions-list',
  standalone: true,
  imports: [
    TradingViewComponent,
    CommonModule,
    HttpClientModule,
    TradingActionsComponent,
    SidePanelComponent
  ],
  templateUrl: './actions-list.component.html',
  styles: [`
    .parent {
      display: flex;
      height: 100vh;
    }
    .div1 {
      width: 300px;
      background-color: #131722;
      color: #d1d4dc;
      overflow-y: auto;
    }
    .div2 {
      flex: 1;
    }
    .actions-list {
      padding: 1rem;
    }
    .stock-item {
      padding: 0.75rem;
      border-bottom: 1px solid #363c4e;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
    }
    .stock-item:hover {
      background-color: #1e222d;
      transform: translateX(5px);
    }
    .stock-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    .symbol {
      font-weight: bold;
      color: #26a69a;
    }
    .name {
      color: #d1d4dc;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    .price-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    .price {
      color: #d1d4dc;
    }
    .change-positive {
      color: #26a69a;
    }
    .change-negative {
      color: #ef5350;
    }
    .loading {
      color: #d1d4dc;
      text-align: center;
      padding: 1rem;
    }
    .error {
      color: #ef5350;
      text-align: center;
      padding: 1rem;
    }
    .search-box {
      padding: 1rem;
      background-color: #1e222d;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .search-input {
      width: 100%;
      padding: 0.5rem;
      background-color: #131722;
      border: 1px solid #363c4e;
      color: #d1d4dc;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    .search-input:focus {
      outline: none;
      border-color: #26a69a;
      box-shadow: 0 0 0 2px rgba(38, 166, 154, 0.2);
    }
    .no-results {
      color: #d1d4dc;
      text-align: center;
      padding: 1rem;
      font-style: italic;
    }
    .highlight {
      background-color: rgba(38, 166, 154, 0.2);
      padding: 0 2px;
      border-radius: 2px;
    }
    .search-count {
      color: #d1d4dc;
      font-size: 0.8rem;
      margin-top: 0.5rem;
      text-align: right;
    }
  `]
})
export class ActionsListComponent implements OnInit {
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  loading: boolean = true;
  error: string | null = null;

  private apiKey = 'EORRW4RTWMBBPUCJ'; // Reemplazar con tu API key
  currentSearchTerm: string = '';

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  ngOnInit() {
    this.initializeStocks();
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim();
    this.currentSearchTerm = term;
    this.filterStocks(term);
  }

  private filterStocks(term: string) {
    if (!term) {
      this.filteredStocks = this.stocks;
    } else {
      const searchTerm = term.toUpperCase();

      // Si es una sola letra, mostrar solo las acciones que empiezan con esa letra
      if (searchTerm.length === 1) {
        this.filteredStocks = this.stocks
          .filter(stock => stock.symbol.startsWith(searchTerm))
          .sort((a, b) => a.symbol.localeCompare(b.symbol));
      } else {
        // Para búsquedas más largas, mantener la lógica existente
        const matchingStocks = this.stocks.filter(stock =>
          stock.symbol.includes(searchTerm) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.filteredStocks = matchingStocks.sort((a, b) => {
          const aExactMatch = a.symbol === searchTerm;
          const bExactMatch = b.symbol === searchTerm;

          if (aExactMatch) return -1;
          if (bExactMatch) return 1;

          const aStartsWith = a.symbol.startsWith(searchTerm);
          const bStartsWith = b.symbol.startsWith(searchTerm);

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          return a.symbol.localeCompare(b.symbol);
        });

        if (this.filteredStocks.length > 0 && this.filteredStocks[0].symbol === searchTerm) {
          this.filteredStocks = [this.filteredStocks[0]];
        }
      }
    }
  }

  highlightText(text: string, searchTerm: string): string {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  private generateStockPrice(symbol: string): { price: number, change: number, changePercent: number } {
    // Precios base realistas para diferentes rangos de acciones
    const priceRanges: { [key: string]: { min: number, max: number } } = {
      'AAPL': { min: 150, max: 200 },
      'MSFT': { min: 250, max: 350 },
      'GOOGL': { min: 100, max: 150 },
      'AMZN': { min: 100, max: 150 },
      'META': { min: 200, max: 300 },
      'TSLA': { min: 150, max: 250 },
      'NVDA': { min: 300, max: 500 },
      'JPM': { min: 100, max: 150 },
      'V': { min: 200, max: 300 },
      'WMT': { min: 100, max: 150 },
      'JNJ': { min: 150, max: 200 },
      'MA': { min: 300, max: 400 },
      'PG': { min: 100, max: 150 },
      'HD': { min: 200, max: 300 },
      'BAC': { min: 20, max: 40 },
      'XOM': { min: 80, max: 120 },
      'DIS': { min: 80, max: 120 },
      'NFLX': { min: 300, max: 400 },
      'PYPL': { min: 50, max: 100 },
      'INTC': { min: 20, max: 40 },
      'CSCO': { min: 40, max: 60 },
      'PFE': { min: 20, max: 40 },
      'KO': { min: 50, max: 70 },
      'PEP': { min: 150, max: 200 },
      'ABT': { min: 80, max: 120 },
      'TMO': { min: 400, max: 600 },
      'DHR': { min: 200, max: 300 },
      'MRK': { min: 80, max: 120 },
      'VZ': { min: 30, max: 50 },
      'CMCSA': { min: 30, max: 50 }
    };

    // Si no hay un rango específico, usar un rango genérico
    const range = priceRanges[symbol] || { min: 20, max: 200 };

    // Generar precio base
    const basePrice = Math.random() * (range.max - range.min) + range.min;
    const price = parseFloat(basePrice.toFixed(2));

    // Generar cambio aleatorio entre -5% y +5%
    const changePercent = (Math.random() * 10 - 5);
    const change = parseFloat((price * changePercent / 100).toFixed(2));

    return {
      price,
      change,
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  }

  private initializeStocks() {
    // Crear la lista de acciones con precios generados
    this.stocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', ...this.generateStockPrice('AAPL') },
      { symbol: 'MSFT', name: 'Microsoft Corporation', ...this.generateStockPrice('MSFT') },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', ...this.generateStockPrice('GOOGL') },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', ...this.generateStockPrice('AMZN') },
      { symbol: 'META', name: 'Meta Platforms Inc.', ...this.generateStockPrice('META') },
      { symbol: 'TSLA', name: 'Tesla Inc.', ...this.generateStockPrice('TSLA') },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', ...this.generateStockPrice('NVDA') },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', ...this.generateStockPrice('JPM') },
      { symbol: 'V', name: 'Visa Inc.', ...this.generateStockPrice('V') },
      { symbol: 'WMT', name: 'Walmart Inc.', ...this.generateStockPrice('WMT') },
      { symbol: 'JNJ', name: 'Johnson & Johnson', ...this.generateStockPrice('JNJ') },
      { symbol: 'MA', name: 'Mastercard Inc.', ...this.generateStockPrice('MA') },
      { symbol: 'PG', name: 'Procter & Gamble Co.', ...this.generateStockPrice('PG') },
      { symbol: 'HD', name: 'Home Depot Inc.', ...this.generateStockPrice('HD') },
      { symbol: 'BAC', name: 'Bank of America Corp.', ...this.generateStockPrice('BAC') },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', ...this.generateStockPrice('XOM') },
      { symbol: 'DIS', name: 'The Walt Disney Company', ...this.generateStockPrice('DIS') },
      { symbol: 'NFLX', name: 'Netflix Inc.', ...this.generateStockPrice('NFLX') },
      { symbol: 'PYPL', name: 'PayPal Holdings Inc.', ...this.generateStockPrice('PYPL') },
      { symbol: 'INTC', name: 'Intel Corporation', ...this.generateStockPrice('INTC') },
      { symbol: 'CSCO', name: 'Cisco Systems Inc.', ...this.generateStockPrice('CSCO') },
      { symbol: 'PFE', name: 'Pfizer Inc.', ...this.generateStockPrice('PFE') },
      { symbol: 'KO', name: 'The Coca-Cola Company', ...this.generateStockPrice('KO') },
      { symbol: 'PEP', name: 'PepsiCo Inc.', ...this.generateStockPrice('PEP') },
      { symbol: 'ABT', name: 'Abbott Laboratories', ...this.generateStockPrice('ABT') },
      { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', ...this.generateStockPrice('TMO') },
      { symbol: 'DHR', name: 'Danaher Corporation', ...this.generateStockPrice('DHR') },
      { symbol: 'MRK', name: 'Merck & Co. Inc.', ...this.generateStockPrice('MRK') },
      { symbol: 'VZ', name: 'Verizon Communications Inc.', ...this.generateStockPrice('VZ') },
      { symbol: 'CMCSA', name: 'Comcast Corporation', ...this.generateStockPrice('CMCSA') }
    ];
    this.filteredStocks = this.stocks;
  }

  onStockClick(stock: Stock): void {
    console.log(`Acción seleccionada: ${stock.symbol}`);
    this.store.dispatch(setSelectedStock({ symbol: stock.symbol }));
  }

  getChangeClass(change: number | undefined): string {
    if (!change) return '';
    return change >= 0 ? 'change-positive' : 'change-negative';
  }
}
