import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon class="dialog-icon">{{data ? 'edit' : 'add'}}</mat-icon>
        {{data ? 'Edit Task' : 'Add New Task'}}
      </h2>

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter task title">
              <mat-icon matSuffix>assignment</mat-icon>
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Enter task description"></textarea>
              <mat-icon matSuffix>description</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Assigned To</mat-label>
              <mat-select formControlName="assignedTo">
                <mat-option *ngFor="let user of users" [value]="user.id">
                  {{user.name}}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="taskForm.get('assignedTo')?.hasError('required')">
                Please assign the task to someone
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row two-columns">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="in-progress">In Progress</mat-option>
                <mat-option value="completed">Completed</mat-option>
              </mat-select>
              <mat-icon matSuffix>update</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
              </mat-select>
              <mat-icon matSuffix>flag</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Due Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dueDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-icon matSuffix>event</mat-icon>
              <mat-error *ngIf="taskForm.get('dueDate')?.hasError('required')">
                Due date is required
              </mat-error>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid">
            {{data ? 'Update' : 'Create'}} Task
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      max-width: 600px;
    }

    mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
    }

    .dialog-icon {
      color: #3f51b5;
    }

    .form-row {
      margin-bottom: 16px;
    }

    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    textarea {
      min-height: 100px;
    }

    mat-dialog-actions {
      padding: 16px 0 0;
      margin: 0;
    }

    @media (max-width: 600px) {
      .two-columns {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private userService: UserService,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: ['', Validators.required],
      status: ['pending'],
      priority: ['medium'],
      dueDate: [new Date(), Validators.required]
    });

    if (data) {
      this.taskForm.patchValue({
        ...data,
        dueDate: new Date(data.dueDate)
      });
    }
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      if (this.data) {
        this.taskService.updateTask({ ...this.data, ...taskData });
      } else {
        this.taskService.addTask(taskData);
      }
      this.dialogRef.close(true);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 