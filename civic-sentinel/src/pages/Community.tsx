import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Search, TrendingUp, MessagesSquare } from "lucide-react";
import NewDiscussionModal, { DiscussionData } from "@/components/NewDiscussionModal";
import { useNavigate } from "react-router-dom";
import { getAllPosts, post } from "@/services/CommunityServices";

const discussionCategories = [
  {
    title: "Policy Updates",
    count: 23,
    description: "Latest regulatory changes and policy discussions",
  },
  {
    title: "Business Support",
    count: 15,
    description: "Connect with other business owners for advice and support",
  },
  {
    title: "Compliance Help",
    count: 18,
    description: "Get help with compliance requirements",
  },
];

const CommunityForum: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [recentDiscussions, setRecentDiscussions] = useState<DiscussionData[]>([]);
  const navigate = useNavigate();

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getAllPosts();
        // Ensure posts is an array; otherwise adjust accordingly.
        setRecentDiscussions(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Handler for posting a new discussion
  const handleNewDiscussionPost = async (discussionData: DiscussionData) => {
    try {
      const postResponse = await post(discussionData);
      console.log("New Discussion Posted:", postResponse);
      // Prepend the new discussion to the existing list
      setRecentDiscussions((prev) => [postResponse, ...prev]);
      setModalOpen(false);
    } catch (error) {
      console.error("Error posting discussion:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Community Forum</h1>
              <p className="text-gray-600">
                Connect, share, and learn from fellow business owners.
              </p>
            </div>
            <Button className="shrink-0" onClick={() => setModalOpen(true)}>
              <MessageSquare className="mr-2" />
              New Discussion
            </Button>
          </div>

          {/* New Discussion Modal */}
          <NewDiscussionModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onPost={handleNewDiscussionPost}
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="discussions" className="w-full">
            <TabsList>
              <TabsTrigger value="discussions">
                <MessagesSquare className="mr-2 h-4 w-4" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="categories">
                <TrendingUp className="mr-2 h-4 w-4" />
                Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discussions" className="space-y-4">
              {recentDiscussions.map((discussion, index) => (
                <Card
                  key={index}
                  className="hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/discussion/${discussion._id}`, { state: discussion })
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{discussion.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{discussion.username}</span>
                          <span>•</span>
                          <span>
                            {new Date(discussion.creationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        <span className="mr-4">{discussion.comments.length} comment{discussion.comments.length !== 1 ? "s" : ""}</span>
                        <span>{discussion.upvotes} upvote{discussion.upvotes !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="categories" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {discussionCategories.map((category, index) => (
                <Card
                  key={index}
                  className="hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {category.count} discussions
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityForum;
