import axios from "axios";

export const policiesPerMonth = async () => {
  const response = await axios.get("/visualize/policies-per-month", {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};
