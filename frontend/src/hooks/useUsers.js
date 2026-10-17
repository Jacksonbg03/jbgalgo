import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/users";

export const useLeaderboard= () => {
  const result = useQuery({
    queryKey: ["leaderboard"],
    queryFn: userApi.getLeaderboard,
  });

  return result;
};

export const useGetUser = (userId) => {
  const result = useQuery({
    queryKey: ["user"],
    queryFn: ()=> userApi.getUser(userId)
  })

  return result;
}

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: userApi.listUsers,
  });
};

export const useUserSubmissions = (id) => {
  return useQuery({
    queryKey: ["userSubmissions", id],
    queryFn: () => userApi.getUserSubmissions(id),
    enabled: !!id,
  });
};

const useAdminUserMutation =(key, mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [key],
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
};

export const useUpdateUserByAdmin = () => useAdminUserMutation("updateUserByAdmin", userApi.updateUserByAdmin);

export const useDeleteUserByAdmin = () => useAdminUserMutation("deleteUserByAdmin", userApi.deleteUserByAdmin);

export const useUpdateUserLevel = () =>{
  const result = useMutation({
    mutationKey: ["level"],
    mutationFn: userApi.updateUserLevel,
  });

  return result
}
