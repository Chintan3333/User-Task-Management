import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserTasksDialogComponent } from '../user-tasks-dialog/user-tasks-dialog.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <mat-card class="header-card">
        <div class="header-content">
          <div class="title-section">
            <h1>Users</h1>
            <p>Manage your team members and their tasks</p>
          </div>
          <button mat-raised-button color="primary" (click)="openUserDialog()">
            <mat-icon>add</mat-icon>
            Add User
          </button>
        </div>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="users" class="mat-elevation-z0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">
              <div class="user-info">
                <mat-icon class="user-icon">person</mat-icon>
                <div class="user-details">
                  <span class="user-name">{{user.name}}</span>
                  <span class="user-email">{{user.email}}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let user">
              <mat-chip [color]="user.role === 'admin' ? 'primary' : 'accent'" selected>
                {{user.role}}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="tasks">
            <th mat-header-cell *matHeaderCellDef>Assigned Tasks</th>
            <td mat-cell *matCellDef="let user">
              <button mat-button color="primary" (click)="viewAssignedTasks(user)">
                <mat-icon>assignment</mat-icon>
                View Tasks ({{getAssignedTasksCount(user.id)}})
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="openUserDialog(user)" matTooltip="Edit User">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(user)" matTooltip="Delete User">
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

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-icon {
      color: #3f51b5;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
    }

    .user-email {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.6);
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .mat-column-role {
      width: 120px;
    }

    .mat-column-tasks {
      width: 200px;
    }

    @media (max-width: 600px) {
      .header-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .mat-column-email {
        display: none;
      }
    }
  `]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  displayedColumns: string[] = ['name', 'role', 'tasks', 'actions'];
  private userSubscription: Subscription = new Subscription();
  private taskSubscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.taskSubscription.unsubscribe();
  }

  loadUsers() {
    this.userSubscription = this.userService.getUsers().subscribe(users => {
      this.users = [...users];
    });
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: user ? { ...user } : undefined
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name && result.email && result.role) {
        if (result.id) {
          this.userService.updateUser(result).subscribe(updatedUser => {
            if (!updatedUser) {
              console.error('Failed to update user');
            }
          });
        } else {
          this.userService.addUser(result).subscribe(newUser => {
            if (!newUser) {
              console.error('Failed to add user');
            }
          });
        }
      }
    });
  }

  deleteUser(user: User) {
    if (user && user.id && confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe();
    }
  }

  getAssignedTasksCount(userId: number): number {
    let count = 0;
    this.taskService.getTasks().pipe(
      take(1)
    ).subscribe(tasks => {
      count = tasks.filter(task => task.assignedTo === userId).length;
    });
    return count;
  }

  viewAssignedTasks(user: User) {
    this.taskService.getTasks().pipe(
      take(1)
    ).subscribe(tasks => {
      const userTasks = tasks.filter(task => task.assignedTo === user.id);
      this.dialog.open(UserTasksDialogComponent, {
        width: '800px',
        data: {
          user: user,
          tasks: userTasks
        }
      });
    });
  }
} 