import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
import { problemsApi } from "../api/problems";

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

export const useSolvedProblem = (userId) =>{
  const result = useQuery({
    queryKey: ["solvedProblem"],
    queryFn: ()=> problemsApi.getSolvedProblem(userId),
  })

  return result;
}

export const useProblemForEdit = (id) => {
  const result = useQuery({
    queryKey: ["problemForEdit", id],
    queryFn: () => problemsApi.getProblemForEdit(id),
    enabled: !!id,
  });

  return result;
};

export const useSubmitProblem = () =>{
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["submitProblem"],
    mutationFn: problemsApi.submitProblem,
    // not invalidating "solvedProblem" here: ProblemPage resets its output panel when that list changes
    onSuccess: (data) => {
      if (data?.passed) queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });

  return result
}

export const useUpdateProblem = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["updateProblem"],
    mutationFn: problemsApi.updateProblem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["problem", variables.problemId] });
      queryClient.invalidateQueries({ queryKey: ["problemForEdit", variables.problemId] });
      queryClient.invalidateQueries({ queryKey: ["solvedProblem"] });
    },
  });

  return result;
};

export const useAddProblem = () =>{
  const result = useMutation({
    mutationKey: ["addProblem"],
    mutationFn: problemsApi.addProblem,
  })

  return result
}
