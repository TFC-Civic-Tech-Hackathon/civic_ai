import axios from "axios";


export const getNotificationByUserId = async (id: string) => {
  const response = await axios.get(`auth/notifications/${id}`,{
    withCredentials: true,
  });
  return response.data;
};