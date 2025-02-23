import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const ProfilePage: React.FC = () => {
  // Retrieve user data from local storage
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;

  if (!userData) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-4xl mx-auto">
          <p className="text-center text-lg">No user data found. Please log in.</p>
        </div>
      </DashboardLayout>
    );
  }

  // Capitalize the first letter of the username
  const capitalizedUsername =
    userData.username.charAt(0).toUpperCase() + userData.username.slice(1);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {capitalizedUsername}'s Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Business Name:</strong> {userData.bizzName}
            </p>
            <p>
              <strong>Business Size:</strong> {userData.bizzSize}
            </p>
            <p>
              <strong>Business Vertical:</strong> {userData.bizzVertical}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Location:</strong> {userData.location}
            </p>
            <p>
              <strong>User ID:</strong> {userData.userID}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
