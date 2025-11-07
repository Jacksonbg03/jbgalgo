import axiosInstance from "../lib/axios";

export const userApi = {
  getLeaderboard: async () => {
    const response = await axiosInstance.get("/user/leaderboard");
    return response.data;
  },

  getUser: async (userId) => {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data;
  },
};

