import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, Search, Shield, TrendingUp, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const WELCOME_MESSAGE = "Hello, [Username]! Your journey to smarter policy tracking and business resilience begins here.";
const STORY_MESSAGE = "Every update is a step on your quest for regulatory mastery – explore the latest insights and turn challenges into opportunities.";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadMessage("");
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
    }
    // Placeholder for file upload logic.
    // For example, you can use FormData and send it to your backend via fetch or axios.
    console.log("Uploading file:", selectedFile);
    setUploadMessage("File uploaded successfully!");
    // Reset the file input after upload if needed:
    setSelectedFile(null);
  };

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
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-start gap-2">
                <Upload className="h-5 w-5" /> Upload Business Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Upload your yearly report, profit and loss statement, or any other key business document.
              </p>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border rounded p-2"
                />
                <button
                  onClick={handleFileUpload}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Upload Document
                </button>
              </div>
              {uploadMessage && (
                <p className="mt-2 text-sm text-green-600">{uploadMessage}</p>
              )}
            </CardContent>
          </Card>
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
