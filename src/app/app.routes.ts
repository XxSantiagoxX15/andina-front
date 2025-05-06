import { Routes } from '@angular/router';
import { RegisterUserComponent } from './components/create-account/create-account.component';
import {TradingViewComponent} from './components/trading-view/trading-view.component';
import {ActionsListComponent} from './components/actions-list/actions-list.component';


export const routes: Routes = [
    {
        path: '',
        component: ActionsListComponent
      },
];


