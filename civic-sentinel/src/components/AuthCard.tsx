
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AuthCard({ children, title, description, className }: AuthCardProps) {
  return (
    <Card className={cn("w-full max-w-lg mx-auto glass-card", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">{title}</CardTitle>
        {description && (
          <CardDescription className="text-center text-lg">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
