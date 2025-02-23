import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadUserDoc } from "@/services/userDocServices";
import { Upload } from "lucide-react";
import { useState } from "react";

export const Insights = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  console.log(userData)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadMessage("");
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
    }
    // Placeholder for file upload logic.
    // For example, you can use FormData and send it to your backend via fetch or axios.
    console.log("Uploading file:", selectedFile);
    setUploadMessage("File uploaded successfully!");
    uploadUserDoc({userId:userData.userID,file:selectedFile})
    // Reset the file input after upload if needed:
    setSelectedFile(null);
  };
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-start gap-2">
                <Upload className="h-5 w-5" /> Upload Business Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Upload your yearly report, profit and loss statement, or any
                other key business document.
              </p>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border rounded p-2"
                />
                <button
                  onClick={handleFileUpload}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Upload Document
                </button>
              </div>
              {uploadMessage && (
                <p className="mt-2 text-sm text-green-600">{uploadMessage}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
