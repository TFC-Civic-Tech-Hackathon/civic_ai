import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import KartikeyImage from "../assets/kartikey.jpeg";
import KartikImage from "../assets/kartik.jpeg";
import AaryanImage from "../assets/aaryan.jpeg";
import AnshulImage from "../assets/anshul.jpeg";
import MuskanImage from "../assets/muskan.jpeg";
import Footer from "@/components/Footer";
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Civic_ai</h1>
          <p className="text-xl mb-8">
            Empowering small businesses with real-time policy tracking and
            actionable insights.
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
          <h2 className="text-3xl font-bold mb-4">About Civic_ai</h2>
          <p className="text-gray-700 mb-8">
            Civic_ai is your all-in-one solution for staying ahead of federal
            policy changes. Our platform provides real-time alerts, intelligent
            policy matching, and a user-friendly dashboard, so you can focus on
            growing your business and staying compliant.
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

      {/* Founders Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Meet Our Founders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
             {
              name:"Kartikey Hebbar",
              url: KartikeyImage
             },
             {
              name:"Kartik Shanbhag",
              url: KartikImage
             },
             {
              name:"Anshul Chaudhary",
              url: AnshulImage
             },
             {
              name:"Muskan Raisinghani",
              url: MuskanImage
             },
             {
              name:"Aaryan Praveen",
              url: AaryanImage
             }
            ].map((founder, index) => (
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

        <Footer/>
    </div>
  );
};

export default HomePage;
