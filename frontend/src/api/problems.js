import axiosInstance from "../lib/axios";

export const problemsApi = {
 getUserProblems: async (userId) => {
    const response = await axiosInstance.get(`/problems/${userId}/problems`);
    return response.data;
  },

  // Ambil problem berdasarkan problemId
  getProblemById: async (problemId) => {
    const response = await axiosInstance.get(`/problems/problem/${problemId}`);
    console.log("INI RESPONSE", response)
    return response.data;
  },

  // Submit jawaban user
  submitProblem: async ({ userId, problemId, solved }) => {
    const response = await axiosInstance.post("/problems/submit", {
      userId,
      problemId,
      solved,
    });
    return response.data;
  },

  // Tambah problem baru (admin)
  addProblem: async (data) => {
    const response = await axiosInstance.post("/problems/add", data);
    return response.data;
  },

  // Ambil leaderboard
  getLeaderboard: async () => {
    const response = await axiosInstance.get("/problems/leaderboard");
    return response.data;
  },
};
