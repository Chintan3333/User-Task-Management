export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: number; // User ID
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
} 