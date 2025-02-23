import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, Search, Shield, TrendingUp, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { agencyDistribution, policiesPerMonth, subAgencyDistribution } from "@/services/VisualizeService";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data array
interface ChartData {
  MONTH_NAME: string;
  POLICY_COUNT: number;
}
interface AgencyData {
  AGENCY: string;
  COUNT: number;
}
interface AgencyDistributionProps{
  data: AgencyData[]
}
interface ChartComponentProps {
  data: ChartData[];
}
interface SubAgencyData {
  SUB_AGENCY: string;
  COUNT: number;
}
interface SubAgencyDistributionProps{
  data: SubAgencyData[]
}
const ChartComponent: React.FC<ChartComponentProps> = ({data}) => {
  return (
    <div className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="MONTH_NAME" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="POLICY_COUNT" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
const AgencyDistribution: React.FC<AgencyDistributionProps> = ({data}) => {
  return (
    <div className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="AGENCY" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="COUNT" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const SubAgencyDistribution: React.FC<SubAgencyDistributionProps> = ({data}) => {
  return (
    <div className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="SUB_AGENCY" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="COUNT" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
const Dashboard = () => {
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const [searchQuery, setSearchQuery] = useState("");
  const capitalizedUsername =
  userData.username.charAt(0).toUpperCase() + userData.username.slice(1);
  const WELCOME_MESSAGE = `Hello, ${capitalizedUsername} ! Your journey to smarter policy tracking and business resilience begins here.`;
  const STORY_MESSAGE = "Every update is a step on your quest for regulatory mastery – explore the latest insights and turn challenges into opportunities.";
  const [policiesPerMonthArr, setPoliciesPerMonthArr] = useState<ChartData[]>([]);
  const [agencyData, setAgencyData] = useState<AgencyData[]>([]);
  const [subAgencyData, setSubAgencyData] = useState<SubAgencyData[]>([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // await your asynchronous code here, e.g.:
        const data = await policiesPerMonth();
        setPoliciesPerMonthArr(data)
        const agencyDistributionData = await agencyDistribution();
        setAgencyData(agencyDistributionData)
        const subAgencyDistributionData =  await subAgencyDistribution();
        setSubAgencyData(subAgencyDistributionData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

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
          <ChartComponent data = {policiesPerMonthArr}/>
          <AgencyDistribution data={agencyData}/>
          <SubAgencyDistribution data={subAgencyData}/>
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
