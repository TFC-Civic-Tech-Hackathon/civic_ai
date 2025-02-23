import axios from "axios";
export const uploadUserDoc = async ({userId,file}): Promise<any> => {
  try {
    const response = await axios.post("/userDoc/", {userId,file}, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading user document:", error);
    throw error;
  }
};