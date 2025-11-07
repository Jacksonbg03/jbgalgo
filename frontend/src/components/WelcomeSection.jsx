import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";
import Typewriter from "./TypeWriter";
import { useNavigate } from "react-router";

function WelcomeSection(user) {
  const navigate = useNavigate();

  return (
<div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between text-center sm:text-left">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-4 justify-center sm:justify-start">
              <Typewriter
                text={`Welcome back, ${user?.user?.firstName || "there"}!`}
              />
            </div>
            <p className="text-xl text-base-content/60 ml-0 sm:ml-1">
              Ready to level up your coding skills?
            </p>
          </div>
          <button
            onClick={() => navigate("/problems")}
            className="hidden sm:flex mt-8 sm:mt-0 group px-8 py-4 bg-gradient-to-r from-[#FFC107] via-[#FF6F00] via-[#FF7F50] to-primary rounded-2xl transition-all duration-200 hover:opacity-90"
          >
            <div className="flex items-center gap-3 text-white font-bold text-lg">
              <ZapIcon className="w-6 h-6 transition duration-300 group-hover:-translate-y-1" />
              <span>Solve the problems</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
