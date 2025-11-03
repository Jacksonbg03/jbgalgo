import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  Trophy,
  UsersIcon,
  Code,
  ZapIcon,
  ClipboardPenLine
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import logo from "../../public/logo.png"
import Model from "../components/Model";
import { Canvas } from "@react-three/fiber";
import ModelCanvas from "../components/Model";
import CountUp from 'react-countup';

function HomePage() {


  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* NAVBAR */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className=" w-full flex items-center">
              <img src={logo} alt="" className="min-w-[30px] w-[30px] h-[30px] rotate"/>
            </div>

            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-wider">
                JBGAlgo
              </span>
              <span className="text-xs text-base-content/60 font-medium -mt-1">Build Together</span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <SignInButton mode="modal">
            <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="badge badge-primary badge-lg !py-4">
              <ZapIcon className="size-4" />
              Real-time Collaboration
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-base-content">Learn Smarter</span>
            </h1>

            <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
              Level up your coding skills through real challenges, contests, and hands-on practice. Solve problems, track your progress, and get ready for real-world interviews.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              <div className="badge badge-lg badge-outline !py-4">
                <CheckIcon className="size-4 text-success" />
                Coding Challenges
              </div>
              <div className="badge badge-lg badge-outline !py-4">
                <CheckIcon className="size-4 text-success" />
                Learning Tracks
              </div>
              <div className="badge badge-lg badge-outline !py-4">
                <CheckIcon className="size-4 text-success" />
                Progress Tracker
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg">
                  Start Coding Now
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>

              <button className="btn btn-outline btn-lg">
                <UsersIcon className="size-5" />
                Join Community
              </button>
            </div>

            {/* STATS */}
            <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
              <div className="stat">
                <div className="stat-value text-primary">
                  <CountUp start={0} end={100} duration={6} separator="," />K+</div>
                <div className="stat-title">Problems Solved</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">
                  <CountUp start={0} end={50} duration={4} separator="," />K+</div>
                <div className="stat-title">Active Coders</div>
              </div>
              <div className="stat">
                <div className="stat-value text-accent">
                  <CountUp start={0} end={99} duration={3} separator="," />%</div>
                <div className="stat-title">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          {/* <img
            src="/hero.png"
            alt="CodeCollab Platform"
            className="w-full h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-105 transition-transform duration-500"
          /> */}
          <ModelCanvas/>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary font-poppins font-extrabold">Succeed</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Powerful features designed to help you learn faster, solve smarter, and level up your skills.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-xl border border-primary/0 transition-all duration-200 hover:border-primary/40 hover:scale-105">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Real Coding Challenges</h3>
              <p className="text-base-content/70">
                Build confidence through hands-on problem solving. Explore questions inspired by real-world interviews and competitive programming.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-xl border border-primary/0 transition-all duration-200 hover:border-primary/40 hover:scale-105">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Trophy className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Contests and Leaderboards</h3>
              <p className="text-base-content/70">
                Challenge yourself in global competitions, track your ranking, and celebrate your growth with every win.
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
              <p className="text-base-content/70">
                See your journey come to life with insights, milestones, and achievements that motivate you to keep going.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
