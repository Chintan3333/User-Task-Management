import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';

interface DialogData {
  user: User;
  tasks: Task[];
}

@Component({
  selector: 'app-user-tasks-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container">
      <div class="header">
        <div class="user-info">
          <mat-icon class="user-icon">person</mat-icon>
          <div class="user-details">
            <h2>{{data.user.name}}'s Tasks</h2>
            <p>{{data.user.email}}</p>
          </div>
        </div>
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="content">
        <div class="stats">
          <div class="stat-card">
            <mat-icon>assignment</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{data.tasks.length}}</span>
              <span class="stat-label">Total Tasks</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>check_circle</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{getCompletedTasksCount()}}</span>
              <span class="stat-label">Completed</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>pending</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{getInProgressTasksCount()}}</span>
              <span class="stat-label">In Progress</span>
            </div>
          </div>
        </div>

        <div class="tasks-list">
          <h3>Task Details</h3>
          <div class="task-cards">
            <mat-card *ngFor="let task of data.tasks" class="task-card">
              <div class="task-header">
                <div class="task-title">
                  <mat-icon>assignment</mat-icon>
                  <span>{{task.title}}</span>
                </div>
                <div class="task-status">
                  <mat-chip [color]="getStatusColor(task.status)" selected>
                    {{task.status}}
                  </mat-chip>
                </div>
              </div>

              <p class="task-description">{{task.description}}</p>

              <div class="task-footer">
                <div class="task-meta">
                  <div class="priority">
                    <mat-icon>flag</mat-icon>
                    <mat-chip [color]="getPriorityColor(task.priority)" selected>
                      {{task.priority}}
                    </mat-chip>
                  </div>
                  <div class="due-date" [class.overdue]="isOverdue(task.dueDate)">
                    <mat-icon>event</mat-icon>
                    <span>{{task.dueDate | date}}</span>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
      max-width: 800px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #3f51b5;
    }

    .user-details h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .user-details p {
      margin: 4px 0 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .content {
      padding: 20px;
      overflow-y: auto;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-card mat-icon {
      color: #3f51b5;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 500;
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }

    .tasks-list h3 {
      margin: 0 0 16px;
      font-size: 18px;
      font-weight: 500;
    }

    .task-cards {
      display: grid;
      gap: 16px;
    }

    .task-card {
      padding: 16px;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .task-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
    }

    .task-title mat-icon {
      color: #3f51b5;
    }

    .task-description {
      margin: 0 0 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-meta {
      display: flex;
      gap: 16px;
    }

    .priority,
    .due-date {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .due-date.overdue {
      color: #f44336;
    }

    @media (max-width: 600px) {
      .stats {
        grid-template-columns: 1fr;
      }

      .task-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .task-meta {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class UserTasksDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<UserTasksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getCompletedTasksCount(): number {
    return this.data.tasks.filter(task => task.status === 'completed').length;
  }

  getInProgressTasksCount(): number {
    return this.data.tasks.filter(task => task.status === 'in-progress').length;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'todo': return 'warn';
      case 'in-progress': return 'accent';
      case 'completed': return 'primary';
      default: return 'primary';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'low': return 'primary';
      case 'medium': return 'accent';
      case 'high': return 'warn';
      default: return 'primary';
    }
  }

  isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }

  onClose() {
    this.dialogRef.close();
  }
} 