"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, AlertTriangle, Info, Award, Bell } from "lucide-react";

const NotificationToast = memo(() => {
  const { notifications, markAsRead, removeNotification } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);
  const [queuedNotifications, setQueuedNotifications] = useState<string[]>([]);

  // Optimized effect for managing notification queue and visibility
  useEffect(() => {
    // Add new unread notifications to queue
    const newNotifications = notifications.filter(n => 
      !n.read && 
      !visibleNotifications.includes(n.id) && 
      !queuedNotifications.includes(n.id)
    );
    
    if (newNotifications.length > 0) {
      setQueuedNotifications(prev => [...prev, ...newNotifications.map(n => n.id)]);
    }

    // Remove notifications that are no longer in the main array
    const removedNotifications = [...visibleNotifications, ...queuedNotifications].filter(id => 
      !notifications.some(n => n.id === id)
    );
    
    if (removedNotifications.length > 0) {
      setVisibleNotifications(prev => prev.filter(id => !removedNotifications.includes(id)));
      setQueuedNotifications(prev => prev.filter(id => !removedNotifications.includes(id)));
    }
  }, [notifications, visibleNotifications, queuedNotifications]);

  // Effect to manage the queue - show max 3 notifications at once
  useEffect(() => {
    if (visibleNotifications.length < 3 && queuedNotifications.length > 0) {
      const nextNotification = queuedNotifications[0];
      
      // Add to visible notifications with a small delay for smooth animation
      const timer = setTimeout(() => {
        setVisibleNotifications(prev => [...prev, nextNotification]);
        setQueuedNotifications(prev => prev.slice(1));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [visibleNotifications, queuedNotifications]);

  // Memoized functions to prevent unnecessary re-renders
  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-purple-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  }, []);

  const getNotificationColor = useCallback((type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'achievement':
        return 'border-purple-200 bg-purple-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50';
    }
  }, []);

  const handleMarkAsRead = useCallback((id: string) => {
    markAsRead(id);
    // Remove from visible notifications and allow next in queue to show
    setVisibleNotifications(prev => prev.filter(notificationId => notificationId !== id));
  }, [markAsRead]);

  const handleRemoveNotification = useCallback((id: string) => {
    removeNotification(id);
    // Remove from visible notifications and allow next in queue to show
    setVisibleNotifications(prev => prev.filter(notificationId => notificationId !== id));
    // Also remove from queue if it's there
    setQueuedNotifications(prev => prev.filter(notificationId => notificationId !== id));
  }, [removeNotification]);

  // Remove conflicting auto-hide timer - now handled by NotificationContext
  // Auto-hide notifications is now managed by the context to avoid conflicts

  // Memoize toast items to prevent unnecessary re-renders
  const toastsToShow = notifications
    .filter(n => visibleNotifications.includes(n.id))
    .map(notification => ({
      ...notification,
      icon: getNotificationIcon(notification.type),
      color: getNotificationColor(notification.type),
      onMarkAsRead: () => handleMarkAsRead(notification.id),
      onRemove: () => handleRemoveNotification(notification.id),
    }));

  if (toastsToShow.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toastsToShow.map((notification, index) => (
        <Card
          key={notification.id}
          className={`${notification.color} border shadow-lg transform transition-all duration-500 ease-out hover:scale-[1.02]`}
          style={{
            animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {notification.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {notification.message}
                    </p>
                    
                    {notification.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 h-7 text-xs"
                        onClick={() => {
                          notification.action?.onClick();
                          handleRemoveNotification(notification.id);
                        }}
                      >
                        {notification.action.label}
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={notification.onMarkAsRead}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </button>
                    
                    <button
                      onClick={notification.onRemove}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Queue indicator */}
      {queuedNotifications.length > 0 && (
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            {queuedNotifications.length} more notification{queuedNotifications.length > 1 ? 's' : ''} queued
          </Badge>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
});

NotificationToast.displayName = 'NotificationToast';

export default NotificationToast;