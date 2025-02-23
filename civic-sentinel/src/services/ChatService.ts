import axios from "axios";

export const query = async (query: string) => {
  const response = await axios.post("query", {
    query: query
  },{headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,});
  return response.data;
};
