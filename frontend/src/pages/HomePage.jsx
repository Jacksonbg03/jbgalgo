import { Link } from "react-router";
import {
  ArrowRightIcon,
  Code2Icon,
  Trophy,
  UsersIcon,
  ZapIcon,
  ClipboardPenLine,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import logo from "../../public/logo.png"
import Model from "../components/Model";
import { Canvas } from "@react-three/fiber";
import ModelCanvas from "../components/Model";
import CountUp from 'react-countup';
import React from "react";

function HomePage() {
  return  (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300 min-h-screen">

      {/* NAVBAR */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              JBGAlgo
            </span>
            <span className="text-xs sm:text-sm text-base-content/60">Build Together</span>
          </div>
        </Link>

        <SignInButton mode="modal">
        <button className="btn btn-primary btn-sm sm:btn-md flex items-center gap-2 px-3">
          <span className="hidden sm:inline">Get Started</span>
          <ArrowRightIcon className="size-5 text-black" />
        </button>
      </SignInButton>

      </div>
    </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col items-center text-center space-y-6 lg:items-start lg:text-left">
              <div className="badge badge-primary badge-lg flex items-center gap-2">
                <ZapIcon className="size-4" /> Real-time Collaboration
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Code Together,
                </span>
                <br />
                <span className="text-base-content">Learn Smarter</span>
              </h1>

              <p className="text-base sm:text-lg text-base-content/70 max-w-xl">
                Level up your coding skills through real challenges, contests, and hands-on practice.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center lg:justify-start lg:items-start w-full lg:w-auto">
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-lg w-full sm:w-auto flex items-center justify-center gap-2">
                    Start Coding Now <ArrowRightIcon className="size-5" />
                  </button>
                </SignInButton>

                <button className="btn btn-outline btn-lg w-full sm:w-auto flex items-center justify-center gap-2">
                  <UsersIcon className="size-5" /> Join Community
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap justify-center gap-4 bg-base-100 shadow-lg p-4 rounded-lg">
            <div className="stat flex-1 min-w-[150px] text-center">
              <div className="stat-value text-primary">
                <CountUp start={0} end={100} duration={6} separator="," />K+
              </div>
              <div className="stat-title">Problems Solved</div>
            </div>

            <div className="stat flex-1 min-w-[150px] text-center">
              <div className="stat-value text-secondary">
                <CountUp start={0} end={50} duration={4} separator="," />K+
              </div>
              <div className="stat-title">Active Coders</div>
            </div>

            <div className="stat flex-1 min-w-[150px] text-center">
              <div className="stat-value text-accent">
                <CountUp start={0} end={99} duration={3} separator="," />%
              </div>
              <div className="stat-title">Uptime</div>
            </div>
          </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full h-64 sm:h-96 lg:h-[500px]">
            <ModelCanvas />
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary font-extrabold">Succeed</span>
          </h2>
          <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto">
            Powerful features designed to help you learn faster, solve smarter, and level up your skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-xl border border-primary/0 transition-all duration-200 hover:border-primary/40 hover:scale-105">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Real Coding Challenges</h3>
              <p className="text-base-content/70 text-sm sm:text-base">
                Build confidence through hands-on problem solving. Explore real-world inspired questions.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-xl border border-primary/0 transition-all duration-200 hover:border-primary/40 hover:scale-105">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Trophy className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Contests & Leaderboards</h3>
              <p className="text-base-content/70 text-sm sm:text-base">
                Challenge yourself in global competitions, track your ranking, and celebrate your growth.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-100 shadow-xl border border-primary/0 transition-all duration-200 hover:border-primary/40 hover:scale-105">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <ClipboardPenLine className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Progress Tracking</h3>
              <p className="text-base-content/70 text-sm sm:text-base">
                See your journey come to life with insights, milestones, and achievements that motivate you.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
export default HomePage;
