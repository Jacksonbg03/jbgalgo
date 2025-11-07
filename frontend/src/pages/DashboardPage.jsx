import { useMyRecentSessions } from "../hooks/useSessions";
import { useLeaderboard } from "../hooks/useUsers";
import { useUser } from "@clerk/clerk-react";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import RecentSessions from "../components/RecentSessions";
import { Leaderboard } from "../components/Leaderboard";
import { CreateProblem } from "../components/CreateProblem";

function DashboardPage() {
  const { user } = useUser();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();
  const { data: leaderboardData } = useLeaderboard();

  const recentSessions = recentSessionsData?.sessions || [];
  const leaderData = leaderboardData?.leaderboard || [];
  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <WelcomeSection user={user}/>

      {user.role === "Admin" ?
      (<div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col gap-2">
         <CreateProblem/>
      </div>) : ""}

      <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col gap-2">
        <Leaderboard data={leaderData} />
        <RecentSessions
          sessions={recentSessions}
          isLoading={loadingRecentSessions}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
