import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import RecentSessions from "../components/RecentSessions";

function DashboardPage() {
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();


  const recentSessions = recentSessionsData?.sessions || [];
  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection/>

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div> */}

          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
