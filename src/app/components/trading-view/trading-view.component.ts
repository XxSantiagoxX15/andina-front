import {Component, AfterViewInit, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-trading-widget',
  template: `<div id="tradingview_12345" style="height: 400px;"></div>`,
  standalone: true
})
export class TradingViewComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const container = document.getElementById('widget-container');
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.onload = () => {
        // @ts-ignore
        new TradingView.widget({
          container_id: 'tradingview_12345',
          width: 600,
          height: 400,
          symbol: 'AAPL',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: false,
          save_image: false,
          studies: ['MACD@tv-basicstudies'],
        });
      };
      document.body.appendChild(script);
    }
  }
}
