import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { problemsApi } from "../api/problems";

// export const useCreateSession = () => {
//   const result = useMutation({
//     mutationKey: ["createSession"],
//     mutationFn: sessionApi.createSession,
//     onSuccess: () => toast.success("Session created successfully!"),
//     onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
//   });

//   return result;
// };

// export const useActiveSessions = () => {
//   const result = useQuery({
//     queryKey: ["activeSessions"],
//     queryFn: sessionApi.getActiveSessions,
//   });

//   return result;
// };

export const useProblems = () => {
  const result = useQuery({
    queryKey: ["problems"],
    queryFn: problemsApi.getProblems,
  });

  return result;
};

export const useProblemById = (id) => {
  const result = useQuery({
    queryKey: ["problem", id],
    queryFn: () => problemsApi.getProblemById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export const useSolvedProblem = () =>{
  const result = useQuery({
    queryKey: ["solvedProblem"],
    queryFn: ()=> problemsApi.getSolvedProblem,
    onSuccess: ()=> toast.success("YES KEAMBIL"),
    onError: (e) => toast.error("Failed to get Data", e)
  })

  return result;
}

export const useSubmitProblem = () =>{
  const result = useMutation({
    mutationKey: ["submitProblem"],
    mutationFn: problemsApi.submitProblem,
    onSuccess: () => toast.success("Congratulations!"),
    onError: (e) => {
      toast.error("Failed to submit Problem: ",e)
    }
  });

  return result
}

// export const useSessionById = (id) => {
//   const result = useQuery({
//     queryKey: ["session", id],
//     queryFn: () => sessionApi.getSessionById(id),
//     enabled: !!id,
//     refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
//   });

//   return result;
// };

// export const useJoinSession = () => {
//   const result = useMutation({
//     mutationKey: ["joinSession"],
//     mutationFn: sessionApi.joinSession,
//     onSuccess: () => toast.success("Joined session successfully!"),
//     onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
//   });

//   return result;
// };

// export const useEndSession = () => {
//   const result = useMutation({
//     mutationKey: ["endSession"],
//     mutationFn: sessionApi.endSession,
//     onSuccess: () => toast.success("Session ended successfully!"),
//     onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
//   });

//   return result;
// };
