import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft } from "lucide-react";

const DiscussionDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Type the discussion object appropriately (this is a simplified example)
  const discussion = location.state as {
    title: string;
    author: string;
    category: string;
    timeAgo: string;
  };
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<string[]>([]);

  const handlePostComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {discussion.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              By {discussion.author} • {discussion.timeAgo}
            </p>
            <p className="mb-4">Category: {discussion.category}</p>
            <p>
              {/* Placeholder for full discussion content */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          <div className="space-y-4">
            {comments.map((c, idx) => (
              <Card key={idx}>
                <CardContent>{c}</CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex gap-4">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow"
            />
            <Button onClick={handlePostComment}>Post Comment</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DiscussionDetails;
