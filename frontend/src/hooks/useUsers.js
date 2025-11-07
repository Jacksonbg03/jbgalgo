import { useQuery} from "@tanstack/react-query";
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

