import axiosInstance from "../lib/axios";

export const userApi = {
  getLeaderboard: async () => {
    const response = await axiosInstance.get("/user/leaderboard");
    return response.data;
  },

  // always the signed-in user (identified by the Clerk session, not the URL)
  getUser: async () => {
    const response = await axiosInstance.get("/user/me");
    return response.data;
  },
  updateUserLevel: async (data) => {
    const response = await axiosInstance.post("/user/level", data);
    return response.data
  }
};

