import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { register } from "@/services/authService";
import { useNavigate } from "react-router-dom";

const BUSINESS_VERTICALS = [
  "Technology",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Financial Services",
  "Education",
  "Food",
  "Agriculture",
  "Other",
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bizzName: "",
    bizzVertical: "",
    location: "",
    bizzSize: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    const { confirmPassword, ...formDataToSend } = formData;
    console.log(formDataToSend);
    try{
      const response = await register(formDataToSend);
      if(response){
        toast({
          title: "Registration Successful",
          description: "",
        });
        navigate("/dashboard")
      }else{
        toast({
          title: "Registration failed",
          description: "",
        });
      }
    }catch(err){
      console.log(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="johnsmith"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@company.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="Business Name">Business Name</Label>
        <Input
          id="bizzName"
          name="bizzName"
          placeholder="Acme Inc."
          value={formData.bizzName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bizzVertical">Business Vertical</Label>
        <Select
          value={formData.bizzVertical}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, bizzVertical: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_VERTICALS.map((vertical) => (
              <SelectItem key={vertical} value={vertical.toLowerCase()}>
                {vertical}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="City, State"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bizzSize">Company Size</Label>
        <Select
          value={formData.bizzSize}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, bizzSize: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_SIZES.map((size) => (
              <SelectItem key={size} value={size.toLowerCase()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full group">
        Create Account
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
}
