import axiosInstance from "../lib/axios";

export const userApi = {
  getLeaderboard: async () => {
    const response = await axiosInstance.get("/user/leaderboard");
    return response.data;
  },
};
