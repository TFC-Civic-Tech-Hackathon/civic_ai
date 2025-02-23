import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pricingPlans = [
  {
    name: "Basic",
    price: "$9/mo",
    features: ["Real-time alerts", "Basic policy matching", "Email support"],
  },
  {
    name: "Standard",
    price: "$19/mo",
    features: ["All Basic features", "Advanced policy matching", "Priority support"],
  },
  {
    name: "Premium",
    price: "$29/mo",
    features: ["All Standard features", "Custom integrations", "Dedicated support"],
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Our Pricing Plans</h1>
          <p className="text-xl mb-8">Choose the plan that fits your business needs.</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-xl mt-2">{plan.price}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <div className="mt-4 text-center">
                    <Button asChild>
                      <Link
                        to="/register-business"
                        className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition"
                      >
                        Get Started
                      </Link>
                    </Button>
                  </div>
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

export default PricingPage;
