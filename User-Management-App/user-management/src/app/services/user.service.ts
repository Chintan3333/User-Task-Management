import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadUsers();
  }

  private loadUsers(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers);
          if (Array.isArray(parsedUsers)) {
            this.users = parsedUsers.filter(user => 
              user && 
              typeof user === 'object' && 
              'id' in user && 
              'name' in user && 
              'email' in user && 
              'role' in user
            );
          }
        } catch (e) {
          console.error('Error parsing users from localStorage:', e);
          this.users = [];
        }
      }
    }
    this.usersSubject.next([...this.users]);
  }

  private saveUsers(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    this.usersSubject.next([...this.users]);
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user);
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    if (!user || !user.name || !user.email || !user.role) {
      return of(null as any);
    }

    const newUser = {
      ...user,
      id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1
    };
    
    this.users = [...this.users, newUser];
    this.saveUsers();
    return of(newUser);
  }

  updateUser(user: User): Observable<User> {
    if (!user || !user.id || !user.name || !user.email || !user.role) {
      return of(null as any);
    }

    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users = [
        ...this.users.slice(0, index),
        user,
        ...this.users.slice(index + 1)
      ];
      this.saveUsers();
    }
    return of(user);
  }

  deleteUser(id: number): Observable<void> {
    this.users = this.users.filter(user => user.id !== id);
    this.saveUsers();
    return of(void 0);
  }
} 