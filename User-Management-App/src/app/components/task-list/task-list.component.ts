import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatSelectModule],
  template: `
    <div class="container">
      <h2>Tasks</h2>
      <button mat-raised-button color="primary" (click)="openTaskDialog()">
        Add Task
      </button>
      
      <table mat-table [dataSource]="tasks" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let task">{{task.title}}</td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let task">{{task.description}}</td>
        </ng-container>

        <ng-container matColumnDef="assignedTo">
          <th mat-header-cell *matHeaderCellDef>Assigned To</th>
          <td mat-cell *matCellDef="let task">{{getUserName(task.assignedTo)}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let task">
            <mat-select [value]="task.status" (selectionChange)="updateTaskStatus(task.id, $event.value)">
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="in-progress">In Progress</mat-option>
              <mat-option value="completed">Completed</mat-option>
            </mat-select>
          </td>
        </ng-container>

        <ng-container matColumnDef="priority">
          <th mat-header-cell *matHeaderCellDef>Priority</th>
          <td mat-cell *matCellDef="let task">
            <mat-select [value]="task.priority" (selectionChange)="updateTaskPriority(task.id, $event.value)">
              <mat-option value="low">Low</mat-option>
              <mat-option value="medium">Medium</mat-option>
              <mat-option value="high">High</mat-option>
            </mat-select>
          </td>
        </ng-container>

        <ng-container matColumnDef="dueDate">
          <th mat-header-cell *matHeaderCellDef>Due Date</th>
          <td mat-cell *matCellDef="let task">{{task.dueDate | date}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let task">
            <button mat-icon-button color="primary" (click)="editTask(task)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteTask(task.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    table {
      width: 100%;
      margin-top: 20px;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
    .mat-column-status, .mat-column-priority {
      width: 150px;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  displayedColumns: string[] = ['title', 'description', 'assignedTo', 'status', 'priority', 'dueDate', 'actions'];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: {
        task: task || {},
        users: this.users
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.taskService.updateTask(result);
        } else {
          this.taskService.addTask(result);
        }
      }
    });
  }

  editTask(task: Task): void {
    this.openTaskDialog(task);
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }

  updateTaskStatus(id: number, status: Task['status']): void {
    this.taskService.updateTaskStatus(id, status);
  }

  updateTaskPriority(id: number, priority: Task['priority']): void {
    this.taskService.updateTaskPriority(id, priority);
  }
} 