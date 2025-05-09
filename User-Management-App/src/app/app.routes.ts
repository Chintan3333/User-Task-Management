import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'tasks', component: TaskListComponent }
]; 