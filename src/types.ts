export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: string; // 'system' | 'security' | 'database' | 'billing' | 'application'
  priority: Priority;
  isRead: boolean;
  timestamp: string; // ISO string
  source: string; // 'Web Console' | 'API Gateway' | 'Monitor System' | 'Kubernetes Agent'
  actionUrl?: string;
  metadata?: Record<string, string>;
}

export interface ActivityLog {
  id: string;
  action: 'create' | 'read' | 'unread' | 'delete' | 'clear_all' | 'read_all';
  details: string;
  timestamp: string; // ISO string
  notificationTitle?: string;
  priority?: Priority;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  criticalCount: number;
  byCategory: Record<string, number>;
  byPriority: Record<Priority, number>;
}
