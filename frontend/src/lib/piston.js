// Code execution goes through our backend (/api/execute), which forwards it to Wandbox.
// Calling the runner from the backend avoids CORS / mixed-content issues and keeps the provider swappable.
import axiosInstance from "./axios";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code, stdin = "") {
  try {
    const response = await axiosInstance.post("/execute", { language, code, stdin }, { timeout: 60000 });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.response?.data?.error || error.message}. Please try again.`,
    };
  }
}
