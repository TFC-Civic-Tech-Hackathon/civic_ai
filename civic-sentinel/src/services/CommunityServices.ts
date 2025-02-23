import axios from "axios";

export const post = async (post) => {
  const response = await axios.post("/posts/create", 
    post,{headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,});
  return response.data;
};
export const getAllPosts = async () => {
  const response = await axios.get("/posts/",{headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,});
  return response.data;
};
