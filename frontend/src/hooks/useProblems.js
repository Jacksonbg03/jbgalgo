import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useSubmitProblem = () =>{
  const result = useMutation({
    mutationKey: ["submitProblem"],
    mutationFn: problemsApi.submitProblem,
  });

  return result
}

export const useAddProblem = () =>{
  const result = useMutation({
    mutationKey: ["addProblem"],
    mutationFn: problemsApi.addProblem,
  })

  return result
}
