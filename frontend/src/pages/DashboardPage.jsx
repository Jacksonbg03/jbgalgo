import { useGetUser, useLeaderboard, useUpdateUserLevel } from "../hooks/useUsers";
import { useSolvedProblem } from "../hooks/useProblems";
import { useUser } from "@clerk/clerk-react";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import { Leaderboard } from "../components/Leaderboard";
import AssignmentsCard from "../components/AssignmentsCard";
import Popup from "../components/Popup";
import { useMemo, useState } from "react";
import { getAssignmentGroups } from "../lib/problemUtils";

function DashboardPage() {
  const { user } = useUser();
  const { data: leaderboardData } = useLeaderboard();
  const { data: userData, isLoading: loadingUser  } = useGetUser(user.id);
  const { data: problems, isLoading: loadingProblems } = useSolvedProblem(user.id);

  const userz = useMemo(() => userData?.user || {}, [userData]);
  const { upcoming } = useMemo(() => getAssignmentGroups(problems, userz), [problems, userz]);
  const totalSolved = (problems || []).filter((p) => p.solved).length;

  const leaderData = leaderboardData?.leaderboard || [];
  const [isLevel, setIsLevel] = useState(false);
  const hasLevel = userz?.level || isLevel;
  const updateUserLevel = useUpdateUserLevel();

  const handleSelect = (level) => {
    setIsLevel(true);
    updateUserLevel.mutate({userId: user.id, level: level})
  };
  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <WelcomeSection user={user} />

      <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col gap-2">
        <AssignmentsCard groups={upcoming} totalSolved={totalSolved} isLoading={loadingProblems} />
        <Leaderboard data={leaderData} />
      </div>

      {!loadingUser && (
        <Popup isLevel={hasLevel} onSelect={handleSelect} />
      )}
    </div>
  );
}

export default DashboardPage;
