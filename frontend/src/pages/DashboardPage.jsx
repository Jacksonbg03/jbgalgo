import { useGetUser, useLeaderboard, useUpdateUserLevel } from "../hooks/useUsers";
import { useUser } from "@clerk/clerk-react";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import { Leaderboard } from "../components/Leaderboard";
import Popup from "../components/Popup";
import { useState } from "react";

function DashboardPage() {
  const { user } = useUser();
  const { data: leaderboardData } = useLeaderboard();
  const { data: userData, isLoading: loadingUser  } = useGetUser(user.id);

  const userz = userData?.user || []

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
      <WelcomeSection user={user}/>
      
      <div className="max-w-7xl mx-auto px-6 pb-16 flex flex-col gap-2">
        <Leaderboard data={leaderData} />
      </div>

      {!loadingUser && (
        <Popup isLevel={hasLevel} onSelect={handleSelect} />
      )}
    </div>
  );
}

export default DashboardPage;
