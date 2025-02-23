import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KartikeyImage from "../assets/kartikey.jpeg";
import KartikImage from "../assets/kartik.jpeg";
import AaryanImage from "../assets/aaryan.jpeg";
import AnshulImage from "../assets/anshul.jpeg";
import MuskanImage from "../assets/muskan.jpeg";
import "./HomePage.css"; // Import your CSS that contains the animation

// Sample features data
const features = [
  {
    title: "Real-time Alerts",
    description:
      "Get instant notifications on policy changes so you never miss an update.",
  },
  {
    title: "Intelligent Matching",
    description:
      "Our AI-powered engine matches policies to your business needs.",
  },
  {
    title: "User-Friendly Dashboard",
    description:
      "Easily manage your compliance tasks and monitor updates with our intuitive dashboard.",
  },
];

const founders = [
  { name: "Kartikey Hebbar", url: KartikeyImage },
  { name: "Kartik Shanbhag", url: KartikImage },
  { name: "Anshul Chaudhary", url: AnshulImage },
  { name: "Muskan Raisinghani", url: MuskanImage },
  { name: "Aaryan Praveen", url: AaryanImage },
];

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Animated Section */}
      <section className="min-h-screen w-full flex justify-center items-center p-4 main text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to PoliSights.ai</h1>
          <p className="text-xl mb-8">
            Empowering small businesses with real-time policy tracking and actionable insights.
          </p>
          <Button asChild>
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition"
            >
              Get Started
            </Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">About PoliSights.ai</h2>
          <p className="text-gray-700 mb-8">
            PoliSights.ai is your all-in-one solution for staying ahead of federal policy changes.
            Our platform provides real-time alerts, intelligent policy matching, and a user-friendly dashboard,
            so you can focus on growing your business and staying compliant.
          </p>
          <Button asChild>
            <Link
              to="/about"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition"
            >
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Founders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {founders.map((founder, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <img
                    src={founder.url}
                    alt={founder.name}
                    className="rounded-full mx-auto mb-4"
                  />
                  <CardTitle className="text-xl font-bold">{founder.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">Co-Founder</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
