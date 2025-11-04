import axiosInstance from "../lib/axios";

export const problemsApi = {
  getSolvedProblem: async (userId) => {
    const response = await axiosInstance.get(`/problems/problem/${userId}/solved`);
    return response.data.problems;
  },

  // Ambil problem berdasarkan problemId
  getProblemById: async (problemId) => {
    const response = await axiosInstance.get(`/problems/problem/${problemId}`);
    return response.data;
  },

  getProblems: async ()=>{
    const response = await axiosInstance.get("/problems/problem");
    return response.data
  },

  // Submit jawaban user
  submitProblem: async (data) => {
    const response = await axiosInstance.post(`/problems/problem/${data.problemId}/submit`, data);
    return response.data;
  },

  // // Tambah problem baru (admin)
  // addProblem: async (data) => {
  //   const response = await axiosInstance.post("/problems/add", data);
  //   return response.data;
  // },

  // Ambil leaderboard
  // getLeaderboard: async () => {
  //   const response = await axiosInstance.get("/problems/leaderboard");
  //   return response.data;
  // },
};
