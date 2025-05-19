import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectSelectedSymbol } from '../../store/stock/stock.selectors';

type Timezone = string;

@Component({
  selector: 'app-trading-widget',
  template: `<div id="tradingview_12345" style="height: 400px;"></div>`,
  standalone: true
})
export class TradingViewComponent implements AfterViewInit, OnDestroy {
  private _symbol: string = 'AAPL';
  private _interval: string = 'D';
  private _containerId: string = 'tradingview_12345';
  private _autosize: boolean = true;
  private widget: any;
  private subscription: Subscription | undefined;
  private scriptLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadScript().then(() => {
        this.scriptLoaded = true;
        this.initWidget(this._symbol);
        this.subscription = this.store.select(selectSelectedSymbol).subscribe(symbol => {
          this._symbol = symbol;
          if (this.scriptLoaded) {
            this.initWidget(this._symbol);
          }
        });
      });
    }
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve) => {
      if (document.getElementById('tradingview-widget-script')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  private initWidget(symbol: string) {
    if (this.widget) {
      this.widget.remove();
      this.widget = null;
    }
    const userTimezone: Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone;
    // @ts-ignore
    this.widget = new TradingView.widget({
      symbol: symbol,
      interval: this._interval,
      container_id: this._containerId,
      timezone: userTimezone,
      locale: 'es',
      autosize: this._autosize,
      fullscreen: false,
      theme: 'dark',
      time_frames: [
        { text: "1D", resolution: "1", description: "1 Día" },
        { text: "1W", resolution: "W", description: "1 Semana" },
        { text: "1M", resolution: "M", description: "1 Mes" },
        { text: "3M", resolution: "3M", description: "3 Meses" },
        { text: "6M", resolution: "6M", description: "6 Meses" },
        { text: "1Y", resolution: "12M", description: "1 Año" },
        { text: "Todo", resolution: "60M", description: "Todo" }
      ],
      disabled_features: [
        'use_localstorage_for_settings',
        'header_chart_type',
        'header_compare',
        'header_fullscreen_button',
        'header_indicators',
        'header_screenshot',
        'header_settings',
        'header_symbol_search',
        'header_undo_redo',
        'save_chart_properties_to_local_storage',
        'border_around_the_chart',
        'symbol_info',
        'symbol_info_long_description',
        'create_volume_indicator_by_default',
        'save_chart_properties_to_local_storage'
      ],
      enabled_features: [
        'study_templates',
        'show_zoom_and_move_buttons_on_touch',
        'horz_touch_drag_scroll',
        'vert_touch_drag_scroll',
        'pinch_scale',
        'hide_left_toolbar_by_default',
        'timeframes_toolbar',
        'show_interval_dialog_on_key_press'
      ],
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#26a69a",
        "mainSeriesProperties.candleStyle.downColor": "#ef5350",
        "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
        "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
        "mainSeriesProperties.showCountdown": true,
        "mainSeriesProperties.style": 1,
        "paneProperties.background": "#131722",
        "paneProperties.vertGridProperties.color": "#363c4e",
        "paneProperties.horzGridProperties.color": "#363c4e",
        "scalesProperties.textColor": "#AAA"
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.widget) {
      this.widget.remove();
    }
  }
}
