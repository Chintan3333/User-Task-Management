import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon class="dialog-icon">{{data ? 'edit' : 'person_add'}}</mat-icon>
        {{data ? 'Edit User' : 'Add New User'}}
      </h2>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Enter user's name">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="userForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter user's email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role">
                <mat-option value="user">User</mat-option>
                <mat-option value="admin">Admin</mat-option>
              </mat-select>
              <mat-icon matSuffix>admin_panel_settings</mat-icon>
              <mat-error *ngIf="userForm.get('role')?.hasError('required')">
                Role is required
              </mat-error>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
            {{data ? 'Update' : 'Create'}} User
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      max-width: 500px;
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

    .full-width {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 16px 0 0;
      margin: 0;
    }
  `]
})
export class UserDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required]
    });

    if (data) {
      this.userForm.patchValue(data);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.data) {
        this.userService.updateUser({ ...this.data, ...userData });
      } else {
        this.userService.addUser(userData);
      }
      this.dialogRef.close(true);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 