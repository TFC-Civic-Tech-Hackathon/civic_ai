import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "New Policy Update",
    message:
      "A new policy update has been published. Please review it at your earliest convenience.",
    time: "2h ago",
    read: false,
  },
  {
    id: 2,
    title: "Compliance Deadline Reminder",
    message:
      "Your compliance deadline is approaching. Make sure all required documents are up to date.",
    time: "5h ago",
    read: true,
  },
  {
    id: 3,
    title: "Message from Civic Bot",
    message:
      "Civic Bot has a new message for you regarding recent discussions.",
    time: "1d ago",
    read: false,
  },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="hover:bg-accent/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">{notification.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.time}
                </p>
              </CardContent>
              {!notification.read && (
                <div className="flex justify-end p-4">
                  <Button
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
