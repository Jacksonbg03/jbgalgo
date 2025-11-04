import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { useSolvedProblem} from "../hooks/useProblems";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Checkbox } from "../components/Checkbox";
import { useUser } from "@clerk/clerk-react";
import { useState, useMemo } from "react";

function ProblemsPage() {
  const { user } = useUser();
  const { data:solvedProblems } = useSolvedProblem(user.id);
  
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

  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

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
    .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
}, [problems, filters]);


  if (!problems) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const easyProblemsCount = filteredProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = filteredProblems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = filteredProblems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="w-full flex gap-10 items-start">
          <div className="w-[80%] space-y-4">
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
                  <div className="flex items-center justify-between gap-4">
                    {/* LEFT SIDE */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Code2Icon className="size-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold">{problem.title}</h2>
                            <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-base-content/60"> {problem.category.join(" | ")}</p>
                        </div>
                      </div>
                      <p className="text-base-content/80 mb-3">{problem.description.text}</p>
                    </div>
                    {/* RIGHT SIDE */}

                    <div className="flex items-center gap-2 text-primary">
                      <span className="font-medium">Solve</span>
                      <ChevronRightIcon className="size-5" />
                    </div>
                  </div>
                </div>
              </Link>
            )))}
          </div>
          <div className="w-[20%] sticky top-20">
            <div className="container mt-4 border-b-1 pb-4 border-[#dbdbdb]">
              <h4 className="text-[14px] font-bold mb-1 text-[#dbdbdb]">STATUS</h4>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.status.solved} onChange={()=> handleCheckboxChange("status", "solved")}/>
                <span className="text-[14px] font-medium">Solved</span>
              </div>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.status.unsolved} onChange={()=> handleCheckboxChange("status", "unsolved")}/>
                <span className="text-[14px] font-medium">Unsolved</span>
              </div>
            </div>
            <div className="container mt-4 border-b-1 pb-4 border-[#dbdbdb]">
              <h4 className="text-[14px] font-bold mb-1 text-[#dbdbdb]">DIFFICULTY</h4>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.difficulty.Easy} onChange={()=> handleCheckboxChange("difficulty", "Easy")}/>
                <span className="text-[14px] font-medium">Easy</span>
              </div>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.difficulty.Medium} onChange={()=> handleCheckboxChange("difficulty", "Medium")}/>
                <span className="text-[14px] font-medium">Medium</span>
              </div>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.difficulty.Hard} onChange={()=> handleCheckboxChange("difficulty", "Hard")}/>
                <span className="text-[14px] font-medium">Hard</span>
              </div>
            </div>
            <div className="container mt-4 pb-4">
              <h4 className="text-[14px] font-bold mb-1 text-[#dbdbdb]">CATEGORY</h4>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.category["String"]} onChange={()=> handleCheckboxChange("category", "String")}/>
                <span className="text-[14px] font-medium">String</span>
              </div>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.category["Array"]} onChange={()=> handleCheckboxChange("category", "Array")}/>
                <span className="text-[14px] font-medium">Array</span>
              </div>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.category["Hash Table"]} onChange={()=> handleCheckboxChange("category", "Hash Table")}/>
                <span className="text-[14px] font-medium">Hash Table</span>
              </div>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.category["Two Pointers"]} onChange={()=> handleCheckboxChange("category", "Two Pointers")}/>
                <span className="text-[14px] font-medium">Two Pointers</span>
              </div>
              <div className="flex gap-2 py-1">
                <Checkbox isChecked={filters.category["Dynamic Programming"]} onChange={()=> handleCheckboxChange("category", "Dynamic Programming")}/>
                <span className="text-[14px] font-medium">Dynamic Programming</span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{filteredProblems.length}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Easy</div>
                <div className="stat-value text-success">{easyProblemsCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Medium</div>
                <div className="stat-value text-warning">{mediumProblemsCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Hard</div>
                <div className="stat-value text-error">{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
