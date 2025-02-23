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
export const agencyDistribution = async () => {
  const response = await axios.get("/visualize/agency-distribution", {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};
export const subAgencyDistribution = async () => {
  const response = await axios.get("/visualize/sub-agency-distribution", {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};