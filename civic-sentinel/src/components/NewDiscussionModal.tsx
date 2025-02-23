import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Adjust import paths as needed
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type DiscussionData = {
  title: string;
  description: string;
  category: string;
};

type NewDiscussionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPost: (data: DiscussionData) => void;
};

const BUSINESS_VERTICALS: string[] = [
  "Technology",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Financial Services",
  "Education",
  "Other",
];

const NewDiscussionModal: React.FC<NewDiscussionModalProps> = ({
  isOpen,
  onClose,
  onPost,
}) => {
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>(BUSINESS_VERTICALS[0]);

  const handlePost = () => {
    onPost({ title: newTitle, description: newDescription, category: newCategory });
    // Reset form fields
    setNewTitle("");
    setNewDescription("");
    setNewCategory(BUSINESS_VERTICALS[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Discussion Title"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Discussion Description"
            className="w-full p-2 border rounded-md resize-none"
            rows={4}
          />
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              {BUSINESS_VERTICALS.map((vertical, index) => (
                <option key={index} value={vertical}>
                  {vertical}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className="flex justify-end space-x-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handlePost}>Post</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewDiscussionModal;
