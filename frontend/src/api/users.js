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
  },

  // admin: manage users
  listUsers: async () => {
    const response = await axiosInstance.get("/user/admin/users");
    return response.data.users;
  },
  updateUserByAdmin: async ({ id, ...data }) => {
    const response = await axiosInstance.patch(`/user/admin/users/${id}`, data);
    return response.data;
  },
  getUserSubmissions: async (id) => {
    const response = await axiosInstance.get(`/user/admin/users/${id}/submissions`);
    return response.data;
  },
  deleteUserByAdmin: async (id) => {
    const response = await axiosInstance.delete(`/user/admin/users/${id}`);
    return response.data;
  },
};

