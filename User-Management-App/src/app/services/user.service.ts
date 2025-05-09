import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.usersSubject.next(this.users);
    }
  }

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
    this.usersSubject.next(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  addUser(user: Omit<User, 'id'>): void {
    const newUser = {
      ...user,
      id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1
    };
    this.users.push(newUser);
    this.saveUsers();
  }

  updateUser(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      this.saveUsers();
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
    this.saveUsers();
  }
} 