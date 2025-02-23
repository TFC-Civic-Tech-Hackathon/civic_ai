import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, Search, Shield, TrendingUp, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";



const Dashboard = () => {
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const [searchQuery, setSearchQuery] = useState("");
  const capitalizedUsername =
  userData.username.charAt(0).toUpperCase() + userData.username.slice(1);
  const WELCOME_MESSAGE = `Hello, ${capitalizedUsername} ! Your journey to smarter policy tracking and business resilience begins here.`;
  const STORY_MESSAGE = "Every update is a step on your quest for regulatory mastery – explore the latest insights and turn challenges into opportunities.";

  const stats = [
    {
      title: "Active Alerts",
      value: "5",
      icon: Bell,
      description: "New policy updates requiring attention",
    },
    {
      title: "Compliance Score",
      value: "92%",
      icon: Shield,
      description: "Your current compliance rating",
    },
    {
      title: "Policy Impact",
      value: "Medium",
      icon: TrendingUp,
      description: "Potential impact on your business",
    },
  ];



  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{WELCOME_MESSAGE}</h1>
            <p className="text-gray-600">{STORY_MESSAGE}</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search policies and updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Upload Business Documents Section */}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="glass-card">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{stat.title}</CardTitle>
                    <p className="text-sm text-gray-600">{stat.description}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-center font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Alerts */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder alerts - these would be populated from your backend */}
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <h3 className="font-medium">New Policy Update #{i + 1}</h3>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
