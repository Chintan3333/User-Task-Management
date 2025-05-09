import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="container">
      <mat-card class="header-card">
        <div class="header-content">
          <div class="title-section">
            <h1>Tasks</h1>
            <p>Manage and track your team's tasks</p>
          </div>
          <button mat-raised-button color="primary" (click)="openTaskDialog()">
            <mat-icon>add</mat-icon>
            Add Task
          </button>
        </div>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="tasks" class="mat-elevation-z0">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Task</th>
            <td mat-cell *matCellDef="let task">
              <div class="task-info">
                <mat-icon class="task-icon">assignment</mat-icon>
                <div class="task-details">
                  <span class="task-title">{{task.title}}</span>
                  <span class="task-description">{{task.description}}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="assignedTo">
            <th mat-header-cell *matHeaderCellDef>Assigned To</th>
            <td mat-cell *matCellDef="let task">
              <div class="user-info">
                <mat-icon class="user-icon">person</mat-icon>
                <span>{{getUserName(task.assignedTo)}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let task">
              <div class="chip-container">
                <mat-chip [color]="getStatusColor(task.status)" selected>
                  <span class="chip-text">{{task.status}}</span>
                </mat-chip>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef>Priority</th>
            <td mat-cell *matCellDef="let task">
              <div class="chip-container">
                <mat-chip [color]="getPriorityColor(task.priority)" selected>
                  <span class="chip-text">{{task.priority}}</span>
                </mat-chip>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Due Date</th>
            <td mat-cell *matCellDef="let task">
              <div class="due-date" [class.overdue]="isOverdue(task.dueDate)">
                {{task.dueDate | date}}
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let task">
              <div class="action-buttons">
                <button mat-icon-button [matMenuTriggerFor]="statusMenu" color="primary" matTooltip="Change Status">
                  <mat-icon>update</mat-icon>
                </button>
                <mat-menu #statusMenu="matMenu">
                  <button mat-menu-item (click)="updateTaskStatus(task, 'pending')">
                    <mat-icon>radio_button_unchecked</mat-icon>
                    <span>Pending</span>
                  </button>
                  <button mat-menu-item (click)="updateTaskStatus(task, 'in-progress')">
                    <mat-icon>pending</mat-icon>
                    <span>In Progress</span>
                  </button>
                  <button mat-menu-item (click)="updateTaskStatus(task, 'completed')">
                    <mat-icon>check_circle</mat-icon>
                    <span>Completed</span>
                  </button>
                </mat-menu>

                <button mat-icon-button [matMenuTriggerFor]="priorityMenu" color="accent" matTooltip="Change Priority">
                  <mat-icon>flag</mat-icon>
                </button>
                <mat-menu #priorityMenu="matMenu">
                  <button mat-menu-item (click)="updateTaskPriority(task, 'low')">
                    <mat-icon>flag</mat-icon>
                    <span>Low</span>
                  </button>
                  <button mat-menu-item (click)="updateTaskPriority(task, 'medium')">
                    <mat-icon>flag</mat-icon>
                    <span>Medium</span>
                  </button>
                  <button mat-menu-item (click)="updateTaskPriority(task, 'high')">
                    <mat-icon>flag</mat-icon>
                    <span>High</span>
                  </button>
                </mat-menu>

                <button mat-icon-button color="primary" (click)="openTaskDialog(task)" matTooltip="Edit Task">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTask(task)" matTooltip="Delete Task">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .header-card {
      background: linear-gradient(45deg, #3f51b5, #7986cb);
      color: white;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }

    .title-section h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .title-section p {
      margin: 8px 0 0;
      opacity: 0.8;
    }

    .table-card {
      padding: 20px;
    }

    table {
      width: 100%;
    }

    .task-info {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .task-icon {
      color: #3f51b5;
    }

    .task-details {
      display: flex;
      flex-direction: column;
    }

    .task-title {
      font-weight: 500;
    }

    .task-description {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.6);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-icon {
      color: #3f51b5;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .due-date {
      font-weight: 500;
    }

    .due-date.overdue {
      color: #f44336;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .mat-column-actions {
      width: 200px;
      text-align: center;
    }

    .mat-column-status,
    .mat-column-priority {
      width: 120px;
    }

    .mat-column-dueDate {
      width: 150px;
    }

    @media (max-width: 600px) {
      .header-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .mat-column-description,
      .mat-column-dueDate {
        display: none;
      }
    }

    .chip-container {
      display: inline-block;
    }

    .chip-text {
      text-transform: capitalize;
      font-weight: 500;
      color: white !important;
    }

    ::ng-deep {
      .mat-mdc-chip {
        color: white !important;
      }

      .mat-mdc-chip.mat-success {
        background-color: green !important;
        color: white !important;
      }

      .mat-mdc-chip.mat-warn {
        background-color: red !important;
        color: white !important;
      }

      .mat-mdc-chip.mat-primary {
        background-color: purple !important;
        color: white !important;
      }

      .mat-mdc-chip.mat-accent {
        background-color: purple !important;
        color: white !important;
      }

      .mat-mdc-chip .mdc-evolution-chip__text-label {
        color: white !important;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  displayedColumns: string[] = ['title', 'assignedTo', 'status', 'priority', 'dueDate', 'actions'];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'accent';
      case 'pending':
        return 'warn';
      default:
        return 'default';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'warn';
      case 'medium':
        return 'accent';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  }

  isOverdue(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const taskDueDate = new Date(dueDate);
    taskDueDate.setHours(0, 0, 0, 0); // Reset time to start of day
    return taskDueDate < today;
  }

  openTaskDialog(task?: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  updateTaskStatus(task: Task, status: 'pending' | 'in-progress' | 'completed') {
    this.taskService.updateTaskStatus(task.id, status);
    this.loadTasks();
  }

  updateTaskPriority(task: Task, priority: 'low' | 'medium' | 'high') {
    this.taskService.updateTaskPriority(task.id, priority);
    this.loadTasks();
  }

  deleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id);
      this.loadTasks();
    }
  }
} 