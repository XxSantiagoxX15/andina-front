import { Routes } from '@angular/router';
import { RegisterUserComponent } from './components/create-account/create-account.component';
import {TradingViewComponent} from './components/trading-view/trading-view.component';
import {ActionsListComponent} from './components/actions-list/actions-list.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin-view/admin-view.component';


export const routes: Routes = [
    {
        path: '',
        component: ActionsListComponent
      },
      {
        path: 'register',
        component: RegisterUserComponent
      },

      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
];


