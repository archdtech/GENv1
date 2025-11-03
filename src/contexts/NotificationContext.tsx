"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
  userId: string;
}

export function NotificationProvider({ children, userId }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load notifications from localStorage on mount - optimized with debounce
  useEffect(() => {
    if (isInitialized) return;
    
    const loadNotifications = () => {
      try {
        const savedNotifications = localStorage.getItem(`notifications-${userId}`);
        if (savedNotifications) {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    // Use requestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadNotifications);
    } else {
      setTimeout(loadNotifications, 0);
    }
  }, [userId, isInitialized]);

  // Optimized localStorage save with debounce
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(`notifications-${userId}`, JSON.stringify(notifications));
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(saveTimeout);
  }, [notifications, userId, isInitialized]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => {
      // Keep only last 50 notifications to prevent memory issues
      const updated = [newNotification, ...prev].slice(0, 50);
      return updated;
    });

    // Auto-remove non-persistent notifications after 5 seconds (consistent with toast)
    if (!newNotification.persistent) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
      
      // Store timer ID for cleanup
      (newNotification as any)._timer = timer;
    }

    // Show browser notification if permitted - use setTimeout to avoid blocking
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        } catch (error) {
          console.error('Error showing browser notification:', error);
        }
      }
    }, 0);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notificationToRemove = prev.find(n => n.id === id);
      // Clear any pending auto-removal timer
      if (notificationToRemove && (notificationToRemove as any)._timer) {
        clearTimeout((notificationToRemove as any)._timer);
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications(prev => {
      // Clear all pending auto-removal timers
      prev.forEach(notification => {
        if ((notification as any)._timer) {
          clearTimeout((notification as any)._timer);
        }
      });
      return [];
    });
  }, []);

  // Memoize expensive calculations
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const value: NotificationContextType = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification, clearAllNotifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook for triggering common notifications
export function useNotificationTriggers() {
  const { addNotification } = useNotifications();

  const triggerMealLogged = useCallback((mealName: string, alignmentScore: number) => {
    addNotification({
      type: 'success',
      title: 'Meal Logged Successfully!',
      message: `${mealName} logged with ${alignmentScore}% DNA alignment.`,
      persistent: false,
    });
  }, [addNotification]);

  const triggerStreakMilestone = useCallback((streakType: string, days: number) => {
    addNotification({
      type: 'achievement',
      title: 'Streak Milestone! 🔥',
      message: `You've reached ${days} days of ${streakType}! Keep up the great work.`,
      persistent: true,
      action: {
        label: 'View Progress',
        onClick: () => console.log('View progress for', streakType),
      },
    });
  }, [addNotification]);

  const triggerLevelUp = useCallback((newLevel: number) => {
    addNotification({
      type: 'achievement',
      title: 'Level Up! 🎉',
      message: `Congratulations! You've reached Level ${newLevel} in your DNA nutrition journey.`,
      persistent: true,
      action: {
        label: 'Celebrate',
        onClick: () => console.log('Celebrate level', newLevel),
      },
    });
  }, [addNotification]);

  const triggerDNAAnalysisComplete = useCallback((profileId: string) => {
    addNotification({
      type: 'success',
      title: 'DNA Analysis Complete! 🧬',
      message: 'Your genetic profile has been processed. New insights are available!',
      persistent: true,
      action: {
        label: 'View Insights',
        onClick: () => console.log('View DNA insights for', profileId),
      },
    });
  }, [addNotification]);

  const triggerNutrientAlert = useCallback((nutrient: string, status: 'low' | 'high') => {
    addNotification({
      type: 'warning',
      title: 'Nutrient Balance Alert ⚠️',
      message: `Your ${nutrient} intake is ${status === 'low' ? 'below' : 'above'} optimal levels based on your DNA profile.`,
      persistent: true,
      action: {
        label: 'Get Recommendations',
        onClick: () => console.log('Get recommendations for', nutrient),
      },
    });
  }, [addNotification]);

  const triggerActivityReminder = useCallback(() => {
    addNotification({
      type: 'info',
      title: 'Activity Reminder 🏃‍♂️',
      message: 'Time to get moving! Your DNA profile suggests regular activity for optimal health.',
      persistent: false,
    });
  }, [addNotification]);

  const triggerMealReminder = useCallback(() => {
    addNotification({
      type: 'info',
      title: 'Meal Reminder 🍽️',
      message: 'Remember to log your meal to track your DNA-powered nutrition journey.',
      persistent: false,
    });
  }, [addNotification]);

  return {
    triggerMealLogged,
    triggerStreakMilestone,
    triggerLevelUp,
    triggerDNAAnalysisComplete,
    triggerNutrientAlert,
    triggerActivityReminder,
    triggerMealReminder,
  };
}