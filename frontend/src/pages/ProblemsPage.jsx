import { Link, Navigate } from "react-router";
import Navbar from "../components/Navbar";

import { useSolvedProblem} from "../hooks/useProblems";
import { ChevronRightIcon, CirclePlus, Code2Icon, Plus } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useState, useMemo } from "react";
import { FilterSection } from "../components/FilterSection";
import { Stat } from "../components/Stat";
import { useNavigate } from "react-router";
import { useGetUser } from "../hooks/useUsers";

function ProblemsPage() {
  const { user } = useUser();
  const { data:solvedProblems } = useSolvedProblem(user.id);
  const { data: userData } = useGetUser(user.id);

  const userz = userData?.user || []

  const navigate = useNavigate();
  const problems = solvedProblems

  const [filters, setFilters] = useState({
    status: { solved: false, unsolved: false },
    difficulty: { Easy: false, Medium: false, Hard: false },
    category: {
      "String": false,
      "Array": false,
      "Hash Table": false,
      "Two Pointers": false,
      "Dynamic Programming": false,
    },
  });
  
  const handleCheckboxChange = (type, key) => {
    setFilters((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key],
      },
    }));
  };

  
const filteredProblems = useMemo(() => {
  if (!problems || !Array.isArray(problems)) return [];

  return problems
    .filter((p) => {
      // STATUS
      const { solved, unsolved } = filters.status;
      let statusCheck = (p.solved && solved) || (!p.solved && unsolved);
      if (!solved && !unsolved) statusCheck = true;

      // DIFFICULTY
      const difficulties = Object.values(filters.difficulty);
      const isAnyDifficultyChecked = difficulties.some(Boolean);
      let difficultyCheck = filters.difficulty[p.difficulty];
      if (!isAnyDifficultyChecked) difficultyCheck = true;

      // CATEGORY
      const categories = Object.values(filters.category);
      const isAnyCategoryChecked = categories.some(Boolean);
      let categoryCheck = Array.isArray(p.category)
        ? p.category.some(cat => filters.category[cat])
        : filters.category[p.category];
      if (!isAnyCategoryChecked) categoryCheck = true;

      return statusCheck && difficultyCheck && categoryCheck;
    })
}, [problems, filters]);


  if (!problems) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const easyProblemsCount = filteredProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = filteredProblems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = filteredProblems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

        <div className="w-full lg:w-[80%] space-y-4">
          <div className="flex justify-between">
            <div className="mb-8 text-center md:text-left w-full">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Practice Problems</h1>
              <p className="text-base-content/70 text-sm md:text-base">
                Sharpen your coding skills with these curated problems
              </p>
            </div>
            {userz.role === "Admin" ? (
              <button
              onClick={() => navigate("/problems/add")}
              className=" items-center justify-center h-[40px] w-60 hidden sm:flex mt-8 sm:mt-0 group px-4 py-4 bg-gradient-to-r from-[#FFC107] via-[#FF6F00] via-[#FF7F50] to-primary rounded-lg transition-all duration-200 hover:opacity-90"
            >
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                <span className="text-[16px]">Add Problem</span>
                <CirclePlus className="w-5 h-5" />
              </div>
            </button>
            ): ""}
          </div>
        </div>
        <div className="hidden lg:block w-full lg:w-[20%] lg:sticky top-20 bg-base-300/10 p-4 rounded-xl shadow-sm"></div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* PROBLEM LIST */}
          <div className="w-full lg:w-[80%] space-y-4">
            {filteredProblems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-12 text-lg text-base-content/70">
                Problem not found :(
              </div>
            ) : (
              filteredProblems.map((problem) => (
                <Link
                  key={problem.problemId}
                  to={`/problem/${problem.problemId}`}
                  className="card bg-base-100 hover:scale-[1.01] transition-transform"
                >
                  <div className="card-body">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* LEFT SIDE */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Code2Icon className="size-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h2 className="text-lg sm:text-xl font-bold">{problem.title}</h2>
                              <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                              {problem?.solved === true ? (<span className="badge bg-green-500/20 text-green-400 border border-green-500/30">
                                Solved
                              </span>): ""}
                            </div>
                            <p className="text-sm text-base-content/60">
                              {problem.category.join(" | ")}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-base-content/80 mb-3">
                          {problem.description.text}
                        </p>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex items-center gap-2 text-primary self-end sm:self-auto">
                        <span className="font-medium">Solve</span>
                        <ChevronRightIcon className="size-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* FILTER SIDEBAR */}
          <div className="hidden lg:block w-full lg:w-[20%] lg:sticky top-20 bg-base-300/10 p-4 rounded-xl shadow-sm">
            <FilterSection
              title="STATUS"
              options={[
                { label: "Solved", value: "solved", type: "status" },
                { label: "Unsolved", value: "unsolved", type: "status" },
              ]}
              filters={filters}
              onChange={handleCheckboxChange}
            />

            <FilterSection
              title="DIFFICULTY"
              options={[
                { label: "Easy", value: "Easy", type: "difficulty" },
                { label: "Medium", value: "Medium", type: "difficulty" },
                { label: "Hard", value: "Hard", type: "difficulty" },
              ]}
              filters={filters}
              onChange={handleCheckboxChange}
            />

            <FilterSection
              title="CATEGORY"
              options={Object.keys(filters.category).map((key) => ({
                label: key,
                value: key,
                type: "category",
              }))}
              filters={filters}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex flex-wrap justify-center items-stretch text-center gap-6 sm:gap-10">
              <div className="flex-1 min-w-[120px] max-w-[200px]">
                <Stat title="Total Problems" value={filteredProblems.length} color="text-primary" />
              </div>
              <div className="flex-1 min-w-[120px] max-w-[200px]">
                <Stat title="Easy" value={easyProblemsCount} color="text-success" />
              </div>
              <div className="flex-1 min-w-[120px] max-w-[200px]">
                <Stat title="Medium" value={mediumProblemsCount} color="text-warning" />
              </div>
              <div className="flex-1 min-w-[120px] max-w-[200px]">
                <Stat title="Hard" value={hardProblemsCount} color="text-error" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
