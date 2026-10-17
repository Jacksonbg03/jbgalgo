import { Link, Navigate } from "react-router";
import Navbar from "../components/Navbar";

import { useSolvedProblem} from "../hooks/useProblems";
import { ChevronRightIcon, CirclePlus, Code2Icon, PencilIcon, Plus, SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { getDeadlineInfo, problemLevels } from "../lib/problemUtils";
import DeadlineBadge from "../components/DeadlineBadge";
import { useUser } from "@clerk/clerk-react";
import { useState, useMemo } from "react";
import { FilterSection } from "../components/FilterSection";
import { Stat } from "../components/Stat";
import { useNavigate } from "react-router";
import { useGetUser } from "../hooks/useUsers";

// a problem counts as "new" for a week after it is created, until the student solves it
const NEW_FOR_DAYS = 7;
const isNewProblem = (p) =>
  !p.solved && !!p.createdAt && Date.now() - new Date(p.createdAt).getTime() < NEW_FOR_DAYS * 24 * 60 * 60 * 1000;

const DIFFICULTY_RANK = { Easy: 1, Medium: 2, Hard: 3 };
const byDifficulty = (a, b) =>
  (DIFFICULTY_RANK[a.difficulty] || 0) - (DIFFICULTY_RANK[b.difficulty] || 0) ||
  (a.difficultyLevel || 0) - (b.difficultyLevel || 0) ||
  a.title.localeCompare(b.title);
const byCreated = (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
const deadlineTime = (p) => (p.deadline?.[0] ? new Date(p.deadline[0]).getTime() : Infinity);

const SORTS = {
  newest: { label: "Newest first", compare: (a, b) => byCreated(b, a) },
  oldest: { label: "Oldest first", compare: byCreated },
  easy: { label: "Difficulty: Easy → Hard", compare: byDifficulty },
  hard: { label: "Difficulty: Hard → Easy", compare: (a, b) => byDifficulty(b, a) },
  title: { label: "Title: A → Z", compare: (a, b) => a.title.localeCompare(b.title) },
  deadline: { label: "Deadline: soonest first", compare: (a, b) => deadlineTime(a) - deadlineTime(b) || byCreated(b, a) },
};

function ProblemsPage() {
  const { user } = useUser();
  const { data:solvedProblems } = useSolvedProblem(user.id);
  const { data: userData } = useGetUser(user.id);

  const userz = useMemo(() => userData?.user || {}, [userData]);

  const navigate = useNavigate();
  const problems = solvedProblems

  const [filters, setFilters] = useState({
    status: { new: false, solved: false, unsolved: false, priority: false },
    difficulty: { Easy: false, Medium: false, Hard: false },
    level: { SMP: false, SMA: false, none: false },
    category: {},
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // categories come from the problems themselves instead of a fixed list
  const categoryOptions = useMemo(() => {
    const all = new Set();
    (problems || []).forEach((p) => [].concat(p.category || []).forEach((c) => c && all.add(c)));
    return [...all].sort();
  }, [problems]);

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

  const query = search.trim().toLowerCase();

  return problems
    .filter((p) => {
      // SEARCH
      if (query && !p.title.toLowerCase().includes(query)) return false;

      // STATUS
      const { solved, unsolved, priority } = filters.status;
      // priority = has a deadline for this user that hasn't passed and isn't solved yet
      const deadlineInfo = getDeadlineInfo(p, userz);
      const isPriority = !!deadlineInfo && !deadlineInfo.overdue && !p.solved;

      // LEVEL (admin only)
      const { SMP, SMA, none } = filters.level;
      if (SMP || SMA || none) {
        const levels = problemLevels(p);
        const levelCheck = (SMP && levels.includes("SMP")) || (SMA && levels.includes("SMA")) || (none && levels.length === 0);
        if (!levelCheck) return false;
      }

      let statusCheck = (p.solved && solved) || (!p.solved && unsolved) || (isPriority && priority) || (isNewProblem(p) && filters.status.new);
      if (!solved && !unsolved && !priority && !filters.status.new) statusCheck = true;

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
    .sort(SORTS[sortBy].compare)
}, [problems, filters, search, sortBy, userz]);


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
            {/* SEARCH + SORT */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <label className="input bg-base-100 flex items-center gap-2 w-full sm:flex-1">
                <SearchIcon className="size-4 opacity-60" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search problems"
                  className="grow"
                />
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select bg-base-100 w-full sm:w-60"
                  aria-label="Sort problems"
                >
                  {Object.entries(SORTS).map(([value, s]) => (
                    <option key={value} value={value}>{s.label}</option>
                  ))}
                </select>
                <button onClick={() => setShowFilters((v) => !v)} className="btn bg-base-100 gap-2 lg:hidden">
                  <SlidersHorizontalIcon className="size-4" />
                  Filters
                </button>
              </div>
            </div>

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
                              {isNewProblem(problem) ? (
                                <span className="badge badge-accent font-bold tracking-wide">NEW</span>
                              ) : ""}
                              <h2 className="text-lg sm:text-xl font-bold">{problem.title}</h2>
                              <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                              {problem?.hidden ? (
                                <span className="badge badge-ghost">Hidden</span>
                              ) : ""}
                              {problem?.solved === true ? (<span className="badge bg-green-500/20 text-green-400 border border-green-500/30">
                                Solved
                              </span>): ""}
                              <DeadlineBadge problem={problem} user={userz} />
                              {userz.role === "Admin" && problemLevels(problem).map((lvl) => (
                                <span key={lvl} className="badge badge-outline">{lvl}</span>
                              ))}
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
                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        {userz.role === "Admin" ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              // the whole card is a link, so stop it from opening the problem
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/problems/edit/${problem.problemId}`);
                            }}
                            className="btn btn-sm btn-ghost gap-1"
                          >
                            <PencilIcon className="size-4" />
                            Edit
                          </button>
                        ) : ""}
                        <div className="flex items-center gap-2 text-primary">
                          <span className="font-medium">Solve</span>
                          <ChevronRightIcon className="size-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* FILTER SIDEBAR */}
          {/* scrolls on its own so long category lists stay reachable */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block order-first lg:order-none w-full lg:w-[20%] lg:sticky top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto overscroll-contain bg-base-300/10 p-4 rounded-xl shadow-sm`}>
            <FilterSection
              title="STATUS"
              options={[
                { label: "New", value: "new", type: "status" },
                { label: "Solved", value: "solved", type: "status" },
                { label: "Unsolved", value: "unsolved", type: "status" },
                { label: "Priority", value: "priority", type: "status"},
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

            {userz.role === "Admin" && (
              <FilterSection
                title="LEVEL"
                options={[
                  { label: "SMP", value: "SMP", type: "level" },
                  { label: "SMA", value: "SMA", type: "level" },
                  { label: "All levels (no level set)", value: "none", type: "level" },
                ]}
                filters={filters}
                onChange={handleCheckboxChange}
              />
            )}

            <FilterSection
              title="CATEGORY"
              options={categoryOptions.map((key) => ({
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
