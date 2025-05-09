import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <div class="toolbar-content">
        <div class="logo">
          <mat-icon>task_alt</mat-icon>
          <span>Task Management</span>
        </div>
        <div class="nav-buttons">
          <button mat-button routerLink="/users" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            Users
          </button>
          <button mat-button routerLink="/tasks" routerLinkActive="active">
            <mat-icon>assignment</mat-icon>
            Tasks
          </button>
        </div>
      </div>
    </mat-toolbar>

    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-content {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .nav-buttons {
      display: flex;
      gap: 8px;
    }

    .nav-buttons button {
      font-size: 1rem;
    }

    .nav-buttons button.active {
      background: rgba(255, 255, 255, 0.1);
    }

    .content {
      max-width: 1200px;
      margin: 80px auto 0;
      padding: 20px;
    }

    @media (max-width: 600px) {
      .toolbar-content {
        padding: 0 8px;
      }

      .logo span {
        display: none;
      }

      .nav-buttons button span {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  title = 'user-management';
}
