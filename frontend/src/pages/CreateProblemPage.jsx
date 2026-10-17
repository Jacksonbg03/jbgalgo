import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { PlusIcon, RefreshCwIcon, Trash2Icon, WandSparklesIcon, XIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAddProblem, useProblemForEdit, useProblems, useUpdateProblem } from "../hooks/useProblems";
import {
  PARAM_TYPES,
  RETURN_TYPES,
  fromDateInputValue,
  fromStoredInput,
  generateStarterCode,
  isValidIdentifier,
  problemLevels,
  toDateInputValue,
  toSnakeCase,
  toStoredInput,
} from "../lib/problemUtils";

const LANGS = [
  { key: "python", label: "Python" },
  { key: "javascript", label: "JavaScript" },
  { key: "java", label: "Java" },
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DIFFICULTY_LEVEL = { Easy: 1, Medium: 2, Hard: 3 };

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

let nextId = 1;
const uid = () => nextId++;

const newRow = (example = false) => ({
  id: uid(),
  input: "",
  expected: { python: "", javascript: "", java: "" },
  graded: true,
  example,
  explanation: "",
});
const newParam = (name = "") => ({ id: uid(), name, type: "int" });

const EMPTY_FORM = {
  problemId: "",
  title: "",
  difficulty: "Easy",
  level: "",
  deadline: "",
  categories: [],
  hidden: false,
  descriptionText: "",
  notes: "",
  constraints: "",
  starter: { python: "", javascript: "", java: "" },
};

function Section({ number, title, description, children }) {
  return (
    <section className="card bg-base-100">
      <div className="card-body gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-3">
            <span className="size-7 rounded-lg bg-primary text-primary-content text-sm flex items-center justify-center">{number}</span>
            {title}
          </h2>
          {description && <p className="text-sm text-base-content/60 mt-1">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-base-content/50">{hint}</span>}
    </label>
  );
}

function SegmentedButtons({ options, value, onChange }) {
  return (
    <div className="join w-full">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`join-item btn btn-sm flex-1 ${value === opt.value ? "btn-primary" : "bg-base-300"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function CategoryInput({ value, onChange, suggestions }) {
  const [draft, setDraft] = useState("");
  const add = (raw) => {
    const name = raw.trim();
    if (name && !value.includes(name)) onChange([...value, name]);
    setDraft("");
  };
  const unused = suggestions.filter((s) => !value.includes(s));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {value.map((cat) => (
          <span key={cat} className="badge badge-primary gap-1 py-3">
            {cat}
            <button type="button" onClick={() => onChange(value.filter((c) => c !== cat))} aria-label={`Remove ${cat}`}>
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            }
          }}
          onBlur={() => draft && add(draft)}
          placeholder="Type a category and press Enter"
          className="input input-sm bg-base-300 flex-1 min-w-48"
        />
      </div>
      {unused.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {unused.slice(0, 12).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="btn btn-xs btn-ghost border border-base-300">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TestCaseRow({ row, index, perLanguage, onChange, onRemove, canRemove }) {
  const set = (patch) => onChange({ ...row, ...patch });
  const setExpected = (lang, value) =>
    set({ expected: perLanguage ? { ...row.expected, [lang]: value } : { python: value, javascript: value, java: value } });
  const inputLines = Math.min(Math.max(row.input.split("\n").length, 2), 8);

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${row.example ? "border-primary/50 bg-primary/5" : "border-base-300 bg-base-200"}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold">Test {index + 1}</span>
        {row.graded && <span className="badge badge-sm">Graded</span>}
        {row.example && <span className="badge badge-sm badge-primary">Example</span>}
        <button type="button" onClick={onRemove} disabled={!canRemove} className="btn btn-xs btn-ghost ml-auto gap-1">
          <Trash2Icon className="size-3" />
          Remove
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Input" hint="One value per line, exactly as the program reads it.">
          <textarea
            value={row.input}
            onChange={(e) => set({ input: e.target.value })}
            rows={inputLines}
            className="textarea bg-base-100 font-mono w-full"
            placeholder={"5\n7"}
          />
        </Field>
        {perLanguage ? (
          <div className="flex flex-col gap-2">
            {LANGS.map((lang) => (
              <Field key={lang.key} label={`Expected output (${lang.label})`}>
                <input
                  value={row.expected[lang.key]}
                  onChange={(e) => setExpected(lang.key, e.target.value)}
                  className="input input-sm bg-base-100 font-mono w-full"
                />
              </Field>
            ))}
          </div>
        ) : (
          <Field label="Expected output" hint="A single line, the same for all languages.">
            <input
              value={row.expected.python}
              onChange={(e) => setExpected("python", e.target.value)}
              className="input bg-base-100 font-mono w-full"
              placeholder="12"
            />
          </Field>
        )}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={row.graded} onChange={(e) => set({ graded: e.target.checked })} />
          Used for grading
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={row.example} onChange={(e) => set({ example: e.target.checked })} />
          Show to students as an example
        </label>
      </div>

      {row.example && (
        <Field label="Example explanation (optional)" hint="Describe the result, not how to compute it.">
          <input value={row.explanation} onChange={(e) => set({ explanation: e.target.value })} className="input input-sm bg-base-100 w-full" />
        </Field>
      )}
    </div>
  );
}

// Used for both /problems/add and /problems/edit/:id
export const AddProblemPage = () => {
  const { id: editId } = useParams();
  const isEdit = !!editId;
  const navigate = useNavigate();

  const { data: existingProblem, isLoading: isLoadingProblem } = useProblemForEdit(editId);
  const { data: allProblems } = useProblems();
  const addProblem = useAddProblem();
  const updateProblem = useUpdateProblem();
  const saving = addProblem.isPending || updateProblem.isPending;

  const [form, setForm] = useState(EMPTY_FORM);
  const [rows, setRows] = useState(() => [newRow(true), newRow(true), newRow()]);
  const [perLanguage, setPerLanguage] = useState(false);
  const [builder, setBuilder] = useState(() => ({ functionName: "", params: [newParam("n")], returnType: "int" }));
  const [starterTouched, setStarterTouched] = useState(isEdit);
  const [activeLang, setActiveLang] = useState("python");
  const [showErrors, setShowErrors] = useState(false);

  const setField = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const categorySuggestions = useMemo(() => {
    const all = new Set();
    (allProblems || []).forEach((p) => [].concat(p.category || []).forEach((c) => c && all.add(c)));
    return [...all].sort();
  }, [allProblems]);

  // ---- starter code builder ----
  const functionName = builder.functionName.trim() || toSnakeCase(form.title) || "solve";
  const builderErrors = [
    !isValidIdentifier(toSnakeCase(functionName)) && "Function name must start with a letter.",
    builder.params.some((p) => !isValidIdentifier(p.name.trim())) && "Every parameter needs a name (letters, numbers, _).",
  ].filter(Boolean);
  const generated = useMemo(
    () => generateStarterCode({ functionName, params: builder.params.map((p) => ({ ...p, name: p.name.trim() })), returnType: builder.returnType }),
    [functionName, builder]
  );

  // new problems: keep the starter code in sync with the builder until it's edited by hand
  useEffect(() => {
    if (!starterTouched && builderErrors.length === 0) setField({ starter: generated });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generated, starterTouched]);

  const regenerate = () => {
    if (builderErrors.length) return toast.error(builderErrors[0]);
    if (starterTouched && !window.confirm("Replace the current starter code with a freshly generated template?")) return;
    setField({ starter: generated });
    setStarterTouched(false);
  };

  // ---- load the problem being edited ----
  useEffect(() => {
    if (!isEdit || !existingProblem) return;
    const p = existingProblem;
    const expectedLines = (lang) => (p.expectedOutput?.[lang] || "").trim().split("\n");
    const exp = { python: expectedLines("python"), javascript: expectedLines("javascript"), java: expectedLines("java") };

    const loadedRows = (p.hiddenInputs || []).map((input, i) => ({
      ...newRow(),
      input: fromStoredInput(input),
      expected: { python: exp.python[i] || "", javascript: exp.javascript[i] || "", java: exp.java[i] || "" },
    }));
    // examples that match a test case become that test's "example" flag; others are example-only rows
    (p.examples || []).forEach((ex) => {
      const match = loadedRows.find(
        (r) => !r.example && toStoredInput(r.input) === toStoredInput(fromStoredInput(ex.input)) && r.expected.python === ex.output
      );
      if (match) {
        match.example = true;
        match.explanation = ex.explanation || "";
      } else {
        loadedRows.push({
          ...newRow(true),
          input: fromStoredInput(ex.input),
          expected: { python: ex.output || "", javascript: ex.output || "", java: ex.output || "" },
          graded: false,
          explanation: ex.explanation || "",
        });
      }
    });

    setRows(loadedRows.length ? loadedRows : [newRow(true)]);
    setPerLanguage(loadedRows.some((r) => r.expected.javascript !== r.expected.python || r.expected.java !== r.expected.python));
    setStarterTouched(true);
    setForm({
      problemId: p.problemId,
      title: p.title || "",
      difficulty: p.difficulty || "Easy",
      level: problemLevels(p)[0] || "",
      deadline: toDateInputValue([].concat(p.deadline || [])[0]),
      categories: [].concat(p.category || []).filter(Boolean),
      hidden: !!p.hidden,
      descriptionText: p.description?.text || "",
      notes: (p.description?.notes || []).join("\n"),
      constraints: (p.constraints || []).join("\n"),
      starter: {
        python: p.starterCode?.python || "",
        javascript: p.starterCode?.javascript || "",
        java: p.starterCode?.java || "",
      },
    });
  }, [isEdit, existingProblem]);

  // ---- validation ----
  const gradedRows = rows.filter((r) => r.graded);
  const exampleRows = rows.filter((r) => r.example);
  const errors = [
    !form.title.trim() && "Add a title.",
    !form.descriptionText.trim() && "Add a description.",
    gradedRows.length === 0 && "Add at least one test case used for grading.",
    exampleRows.length === 0 && "Mark at least one test case as an example.",
    rows.some((r) => !r.input.trim() && (r.graded || r.example)) && "Every test case needs an input.",
    rows.some((r) => LANGS.some((l) => !r.expected[l.key].trim())) && "Every test case needs an expected output.",
    rows.some((r) => LANGS.some((l) => /\n/.test(r.expected[l.key]))) && "Expected output must be a single line.",
    LANGS.some((l) => !form.starter[l.key].trim()) && "Starter code is missing for at least one language.",
  ].filter(Boolean);

  const handleSubmit = () => {
    setShowErrors(true);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    const expectedFor = (lang) => gradedRows.map((r) => r.expected[lang].trim()).join("\n");
    const deadline = fromDateInputValue(form.deadline);
    const payload = {
      problemId: isEdit ? form.problemId : slugify(form.title),
      title: form.title.trim(),
      difficulty: form.difficulty,
      difficultyLevel: DIFFICULTY_LEVEL[form.difficulty],
      category: form.categories,
      description: {
        text: form.descriptionText.trim(),
        notes: form.notes.split("\n").map((n) => n.trim()).filter(Boolean),
      },
      examples: exampleRows.map((r) => ({
        input: toStoredInput(r.input.trim()),
        output: r.expected.python.trim(),
        explanation: r.explanation.trim(),
      })),
      constraints: form.constraints.split("\n").map((c) => c.trim()).filter(Boolean),
      starterCode: form.starter,
      hiddenInputs: gradedRows.map((r) => toStoredInput(r.input.trim())),
      expectedOutput: { python: expectedFor("python"), javascript: expectedFor("javascript"), java: expectedFor("java") },
      level: form.level ? [form.level] : [],
      deadline: deadline ? [deadline] : [],
      hidden: form.hidden,
    };

    const onError = (err) => toast.error(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} problem`);
    const onSuccess = () => {
      toast.success(isEdit ? "Problem updated" : "Problem created");
      navigate("/problems");
    };
    if (isEdit) updateProblem.mutate(payload, { onSuccess, onError });
    else addProblem.mutate(payload, { onSuccess, onError });
  };

  const updateRow = (id, next) => setRows((prev) => prev.map((r) => (r.id === id ? next : r)));
  const setParam = (id, patch) =>
    setBuilder((prev) => ({ ...prev, params: prev.params.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));

  if (isEdit && isLoadingProblem) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <p className="text-center py-24 text-base-content/70">Loading problem...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{isEdit ? "Edit Problem" : "Create Problem"}</h1>
          <p className="text-base-content/70 text-sm md:text-base">
            Fill in the sections below. Students only see the description, the examples and the starter code.
          </p>
        </div>

        {/* 1. BASICS */}
        <Section number={1} title="Basics">
          <Field
            label="Title"
            hint={isEdit ? `Link: /problem/${form.problemId} (stays the same when the title changes)` : form.title ? `Link: /problem/${slugify(form.title)}` : ""}
          >
            <input value={form.title} onChange={(e) => setField({ title: e.target.value })} className="input bg-base-300 w-full" placeholder="Electricity Bill" />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Difficulty">
              <SegmentedButtons options={DIFFICULTIES.map((d) => ({ value: d, label: d }))} value={form.difficulty} onChange={(difficulty) => setField({ difficulty })} />
            </Field>
            <Field label="Level" hint="Students only see problems for their own level. All levels = everyone.">
              <SegmentedButtons
                options={[{ value: "", label: "All levels" }, { value: "SMP", label: "SMP" }, { value: "SMA", label: "SMA" }]}
                value={form.level}
                onChange={(level) => setField({ level })}
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Deadline (optional)" hint="Ends at 23:59 WIB on this day.">
              <div className="flex gap-2">
                <input type="date" value={form.deadline} onChange={(e) => setField({ deadline: e.target.value })} className="input bg-base-300 w-full" />
                {form.deadline && (
                  <button type="button" onClick={() => setField({ deadline: "" })} className="btn btn-ghost" aria-label="Clear deadline">
                    <XIcon className="size-4" />
                  </button>
                )}
              </div>
            </Field>
            <Field label="Visibility">
              <label className="flex items-center gap-3 cursor-pointer h-12">
                <input type="checkbox" className="toggle toggle-primary" checked={form.hidden} onChange={(e) => setField({ hidden: e.target.checked })} />
                <span className="text-sm">{form.hidden ? "Hidden: students can't see this problem" : "Visible to students"}</span>
              </label>
            </Field>
          </div>

          <Field label="Categories">
            <CategoryInput value={form.categories} onChange={(categories) => setField({ categories })} suggestions={categorySuggestions} />
          </Field>
        </Section>

        {/* 2. DESCRIPTION */}
        <Section number={2} title="Description" description="Explain the task and its rules. Avoid hints about how to solve it.">
          <Field label="Description">
            <textarea
              value={form.descriptionText}
              onChange={(e) => setField({ descriptionText: e.target.value })}
              rows={3}
              className="textarea bg-base-300 w-full"
              placeholder="Write a function that returns ..."
            />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Notes" hint="One per line. Rules, output format, etc.">
              <textarea value={form.notes} onChange={(e) => setField({ notes: e.target.value })} rows={4} className="textarea bg-base-300 w-full" />
            </Field>
            <Field label="Constraints" hint="One per line, e.g. 1 <= n <= 1000">
              <textarea value={form.constraints} onChange={(e) => setField({ constraints: e.target.value })} rows={4} className="textarea bg-base-300 w-full font-mono" />
            </Field>
          </div>
        </Section>

        {/* 3. STARTER CODE */}
        <Section
          number={3}
          title="Starter code"
          description="Describe the function students complete. The input and output sections are generated for all three languages."
        >
          <div className="rounded-xl bg-base-200 p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Function name" hint="Python uses snake_case, JavaScript and Java use camelCase automatically.">
                <input
                  value={builder.functionName}
                  onChange={(e) => setBuilder((prev) => ({ ...prev, functionName: e.target.value }))}
                  className="input input-sm bg-base-100 font-mono w-full"
                  placeholder={toSnakeCase(form.title) || "electricity_bill"}
                />
              </Field>
              <Field label="Returns">
                <select
                  value={builder.returnType}
                  onChange={(e) => setBuilder((prev) => ({ ...prev, returnType: e.target.value }))}
                  className="select select-sm bg-base-100 w-full"
                >
                  {Object.entries(RETURN_TYPES).map(([value, t]) => (
                    <option key={value} value={value}>{t.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Parameters (in the order of the input lines)</span>
              {builder.params.map((param, i) => (
                <div key={param.id} className="flex gap-2 items-center">
                  <span className="text-xs text-base-content/50 w-14">Line {i + 1}</span>
                  <input
                    value={param.name}
                    onChange={(e) => setParam(param.id, { name: e.target.value })}
                    className="input input-sm bg-base-100 font-mono flex-1"
                    placeholder="kwh"
                  />
                  <select value={param.type} onChange={(e) => setParam(param.id, { type: e.target.value })} className="select select-sm bg-base-100 w-32">
                    {Object.entries(PARAM_TYPES).map(([value, t]) => (
                      <option key={value} value={value}>{t.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setBuilder((prev) => ({ ...prev, params: prev.params.filter((p) => p.id !== param.id) }))}
                    className="btn btn-sm btn-ghost"
                    aria-label="Remove parameter"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setBuilder((prev) => ({ ...prev, params: [...prev.params, newParam()] }))} className="btn btn-xs btn-ghost gap-1">
                <PlusIcon className="size-3" />
                Add parameter
              </button>
            </div>

            {builder.returnType === "decimal" && (
              <p className="text-xs text-warning">
                Decimal results print differently per language (Python 3.0, JavaScript 3). Prefer integers or text when possible.
              </p>
            )}
            {builderErrors.length > 0 && <p className="text-xs text-error">{builderErrors[0]}</p>}

            <button type="button" onClick={regenerate} className="btn btn-sm btn-primary gap-2">
              {starterTouched ? <RefreshCwIcon className="size-4" /> : <WandSparklesIcon className="size-4" />}
              {starterTouched ? "Regenerate starter code" : "Starter code updates automatically"}
            </button>
          </div>

          <div>
            <div role="tablist" className="tabs tabs-boxed bg-base-200 w-fit mb-2">
              {LANGS.map((lang) => (
                <button key={lang.key} type="button" role="tab" onClick={() => setActiveLang(lang.key)} className={`tab ${activeLang === lang.key ? "tab-active" : ""}`}>
                  {lang.label}
                </button>
              ))}
            </div>
            <textarea
              value={form.starter[activeLang]}
              onChange={(e) => {
                setStarterTouched(true);
                setField({ starter: { ...form.starter, [activeLang]: e.target.value } });
              }}
              rows={14}
              spellCheck={false}
              className="textarea bg-base-300 font-mono text-sm w-full"
            />
            <p className="text-xs text-base-content/50">You can edit the code by hand; it then stops updating from the builder.</p>
          </div>
        </Section>

        {/* 4. TEST CASES */}
        <Section
          number={4}
          title="Test cases"
          description="Graded tests decide whether a solution passes. Tests marked as examples are also shown to students with their answer."
        >
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" checked={perLanguage} onChange={(e) => setPerLanguage(e.target.checked)} />
            Different expected output per language (rarely needed)
          </label>

          <div className="space-y-3">
            {rows.map((row, i) => (
              <TestCaseRow
                key={row.id}
                row={row}
                index={i}
                perLanguage={perLanguage}
                onChange={(next) => updateRow(row.id, next)}
                onRemove={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                canRemove={rows.length > 1}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setRows((prev) => [...prev, newRow()])} className="btn btn-sm gap-1">
              <PlusIcon className="size-4" />
              Add test case
            </button>
            <span className="text-sm text-base-content/60">
              {gradedRows.length} graded · {exampleRows.length} shown as example
            </span>
          </div>
        </Section>

        {/* SAVE */}
        <div className="card bg-base-100 sticky bottom-4 shadow-xl border border-base-300">
          <div className="card-body py-4 flex-row flex-wrap items-center gap-3">
            {showErrors && errors.length > 0 ? (
              <ul className="text-sm text-error list-disc pl-5 flex-1">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-base-content/60 flex-1">
                {gradedRows.length} test case{gradedRows.length === 1 ? "" : "s"} · {form.level || "All levels"}
                {form.deadline ? ` · deadline ${form.deadline}` : ""}
                {form.hidden ? " · hidden" : ""}
              </p>
            )}
            <button type="button" onClick={() => navigate("/problems")} className="btn btn-ghost">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={saving} className="btn btn-primary">
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Problem"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
