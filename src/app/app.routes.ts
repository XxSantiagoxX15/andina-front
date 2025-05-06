import { Routes } from '@angular/router';
import { RegisterUserComponent } from './components/create-account/create-account.component';
import {TradingViewComponent} from './components/trading-view/trading-view.component';


export const routes: Routes = [
    {
        path: '',
        component: TradingViewComponent
      },
];


