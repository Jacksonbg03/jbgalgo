import axiosInstance from "../lib/axios";

export const problemsApi = {
  // problem list with the signed-in user's solved status
  getSolvedProblem: async () => {
    const response = await axiosInstance.get("/problems/solved");
    return response.data.problems;
  },

  // full problem including test cases (admin edit form)
  getProblemForEdit: async (problemId) => {
    const response = await axiosInstance.get(`/problems/problem/${problemId}/full`);
    return response.data;
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

  // Submit jawaban user: server menjalankan test case dan menentukan benar/salah
  submitProblem: async ({ problemId, code, language }) => {
    const response = await axiosInstance.post(`/problems/problem/${problemId}/submit`, { code, language });
    return response.data;
  },

  // // Tambah problem baru (admin)
  addProblem: async (data) => {
    const response = await axiosInstance.post("/problems/add", data);
    return response.data;
  },

  // Edit problem (admin)
  updateProblem: async ({ problemId, ...data }) => {
    const response = await axiosInstance.put(`/problems/problem/${problemId}`, data);
    return response.data;
  },

};
