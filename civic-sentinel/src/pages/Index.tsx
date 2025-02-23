import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import signupGIF from "@/assets/Business solution.gif"
const WELCOME_MESSAGE = "Welcome to PolySights.AI – where your business embarks on a journey to navigate the regulatory landscape with the precision of a modern-day wizard. Let us guide you to stay compliant, informed, and ahead of the curve.";

const Index = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    // <div className="min-h-screen w-full flex  bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="h-screen w-full flex flex-col md:flex-row shadow-lg rounded-lg">
        {/* Left Side: Image Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <img 
            src={signupGIF}
            alt="Storyset illustration" 
            className="object-contain p-8" 
          />

        </div>

        {/* Right Side: Login/Sign Up UI */}
        <div className="w-full md:w-1/2 flex flex-col items-center  p-8 overflow-y-scroll">
          <div className="w-full space-y-8 text-center mb-8 animate-fade-down">
            <h1 className="text-4xl font-bold tracking-tight">PolySights.AI</h1>
            <p className="text-lg text-gray-600">{WELCOME_MESSAGE}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 ">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <AuthCard
                title="Welcome Back"
                description="Sign in to your account to continue your journey"
              >
                <LoginForm />
              </AuthCard>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <AuthCard
                title="Create Your Account"
                description="Join us on a journey to regulatory excellence"
              >
                <RegisterForm />
              </AuthCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    // </div>
  );
};

export default Index;
