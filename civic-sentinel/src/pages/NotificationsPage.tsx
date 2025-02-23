import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { getNotificationByUserId } from "@/services/NotificationService";

type Notification = {
  _id: string;
  ID: string;
  AGENCY: string;
  SUB_AGENCY: string;
  ACTION_TYPE: string;
  SUMMARY: string;
  PUBLIC_INSPECTION_PDF_URL: string;
  PUBLICATION_DATE: string;
  user_id: string;
  is_read: boolean;
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;

  const markAsRead = (id: string) => {
    // Update the notifications state
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, is_read: true } : n))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userData && userData.userID) {
        try {
          const data = await getNotificationByUserId(userData.userID);
          console.log("Notification data:", data);
          // Adjust this based on the structure of your API response:
          const notificationsArray:Notification[] = data.notifications
          setNotifications(notificationsArray);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [0]);

  // Update unread and read notifications whenever notifications change
  useEffect(() => {
    console.log(notifications,"notifications");
    setUnreadNotifications(notifications.filter((n) => !n.is_read));
    setReadNotifications(notifications.filter((n) => n.is_read));
  }, [notifications]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <p className="text-lg">Loading notifications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>

        {/* Unread Notifications Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Unread Notifications</h2>
          {unreadNotifications.length > 0 ? (
            <div className="space-y-4">
              {unreadNotifications.map((notification) => (
                <Card
                  key={notification._id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">
                      {notification.ACTION_TYPE}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Agency:</strong> {notification.AGENCY}
                    </p>
                    <p>{notification.SUMMARY}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(notification.PUBLICATION_DATE).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <div className="flex justify-end p-4">
                    <Button
                      size="sm"
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as read
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No unread notifications.</p>
          )}
        </section>

        {/* Read Notifications Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Read Notifications</h2>
          {readNotifications.length > 0 ? (
            <div className="space-y-4">
              {readNotifications.map((notification) => (
                <Card
                  key={notification._id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">
                      {notification.ACTION_TYPE}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Agency:</strong> {notification.AGENCY}
                    </p>
                    <p>{notification.SUMMARY}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(notification.PUBLICATION_DATE).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No read notifications.</p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
