import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';


import { EmployeeListComponent } from './pages/employee-list/employee-list';
import { EmployeeFormComponent } from './pages/employee-form/employee-form';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee/add', component: EmployeeFormComponent },

  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/new', component: EmployeeFormComponent },
  { path: 'employees/:id/edit', component: EmployeeFormComponent },

  { path: '**', redirectTo: 'login' }
];
