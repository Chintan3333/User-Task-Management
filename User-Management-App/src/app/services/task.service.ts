import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.tasksSubject.next(this.tasks);
    }
  }

  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.tasksSubject.next(this.tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  getTasksByUserId(userId: number): Task[] {
    return this.tasks.filter(task => task.assignedTo === userId);
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask = {
      ...task,
      id: this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1,
      createdAt: new Date()
    };
    this.tasks.push(newTask);
    this.saveTasks();
  }

  updateTask(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
      this.saveTasks();
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  updateTaskStatus(id: number, status: Task['status']): void {
    const task = this.getTaskById(id);
    if (task) {
      this.updateTask({ ...task, status });
    }
  }

  updateTaskPriority(id: number, priority: Task['priority']): void {
    const task = this.getTaskById(id);
    if (task) {
      this.updateTask({ ...task, priority });
    }
  }
} 