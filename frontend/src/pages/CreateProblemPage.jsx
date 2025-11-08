import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Code2Icon } from 'lucide-react'
import { useAddProblem } from '../hooks/useProblems'
import { useNavigate } from 'react-router'
import toast from "react-hot-toast";

export const AddProblemPage = () => {
  const AddProblemMutation = useAddProblem();

  const [form, setForm] = useState({
    problemId: "",
    title: "",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: "",
    descriptionText: "",
    descriptionNotes: "",
    constraints: "",
    javascriptCode: "",
    pythonCode: "",
    javaCode: "",
    expectedOutputJs: "",
    expectedOutputPy: "",
    expectedOutputJava: "",
    hiddenInputs: "",
    examples: [
      { input: "", output: "", explanation: "" }
    ]
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...form.examples];
    newExamples[index][field] = value;
    setForm({ ...form, examples: newExamples });
  };

  const addExample = () => {
    setForm({
      ...form,
      examples: [...form.examples, { input: "", output: "", explanation: "" }],
    });
  };

  const handleRemoveExample = (index) => {
    if (form.examples.length === 1) return; // minimal 1 example
    const updated = [...form.examples];
    updated.splice(index, 1);
    setForm({ ...form, examples: updated });
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    const payload = {
      problemId: form.problemId,
      title: form.title,
      difficulty: form.difficulty,
      difficultyLevel: Number(form.difficultyLevel),
      category: form.category.split(",").map((c) => c.trim()),
      description: {
        text: form.descriptionText,
        notes: form.descriptionNotes.split("\n"),
      },
      examples: form.examples.filter(ex => ex.input && ex.output),
      constraints: form.constraints.split("\n"),
      starterCode: {
        javascript: form.javascriptCode,
        python: form.pythonCode,
        java: form.javaCode,
      },
      expectedOutput: {
        javascript: form.expectedOutputJs,
        python: form.expectedOutputPy,
        java: form.expectedOutputJava,
      },
      hiddenInputs: form.hiddenInputs.split("\n"),
    };

    AddProblemMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("✅ Problem created successfully!");
        navigate("/problems")
      },
      onError: () => {
        toast.error("❌ Failed to create problem");
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

            <div className="w-full lg:w-[80%] space-y-4">
                <div className="flex justify-between">
                    <div className="mb-8 text-center md:text-left w-full">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Problem</h1>
                        <p className="text-base-content/70 text-sm md:text-base">
                            Sharpen your coding skills with these curated problems
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="card bg-base-100 p-6 space-y-6">

          {AddProblemMutation.isSuccess && (
            <div className="alert alert-success shadow-lg">
              <span>✅ Problem created successfully!</span>
            </div>
          )}

          {AddProblemMutation.isError && (
            <div className="alert alert-error shadow-lg">
              <span>❌ Failed to create problem.</span>
            </div>
          )}

          {/* ID + Title */}
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Problem ID</label>
              <input 
                name="problemId"
                value={form.problemId}
                onChange={handleChange}
                className="input bg-base-300 w-full"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Title</label>
              <input 
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input bg-base-300 w-full"
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Difficulty</label>
              <select 
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="select bg-base-300 w-full"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-1">Difficulty Level</label>
              <select 
                name="difficultyLevel"
                value={form.difficultyLevel}
                onChange={handleChange}
                className="select bg-base-300 w-full"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Category (comma separated)</label>
            <input 
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input bg-base-300 w-full"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Description</label>
            <textarea
              name="descriptionText"
              value={form.descriptionText}
              onChange={handleChange}
              className="textarea bg-base-300 w-full"
              rows={3}
              placeholder='Given a list of integers, count how many numbers are negative.'
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Description Notes (one per line)</label>
            <textarea
              name="descriptionNotes"
              value={form.descriptionNotes}
              onChange={handleChange}
              className="textarea bg-base-300 w-full"
              rows={3}
              placeholder='A number is negative if it is less than 0.
Return 0 if there are no negative numbers.
You only need to count, not sum.
'
            />
          </div>

          {/* Examples */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Examples</label>

            {form.examples.map((ex, i) => (
              <div key={i} className="p-3 border border-base-300 rounded-md space-y-2 relative">

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  onClick={() => handleRemoveExample(i)}
                  className="btn btn-xs btn-error absolute top-2 right-2"
                  disabled={form.examples.length === 1}
                >
                  Remove
                </button>

                <input
                  placeholder="Input"
                  value={ex.input}
                  onChange={(e)=>handleExampleChange(i,"input",e.target.value)}
                  className="input bg-base-300 w-full"
                />

                <input
                  placeholder="Output"
                  value={ex.output}
                  onChange={(e)=>handleExampleChange(i,"output",e.target.value)}
                  className="input bg-base-300 w-full"
                />

                <textarea
                  placeholder="Explanation"
                  value={ex.explanation}
                  onChange={(e)=>handleExampleChange(i,"explanation",e.target.value)}
                  className="textarea bg-base-300 w-full"
                  rows={2}
                />
              </div>
            ))}

            <button onClick={addExample} className="btn btn-sm">
              + Add Example
            </button>
          </div>

          {/* Constraints */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Constraints (one per line)</label>
            <textarea name="constraints" value={form.constraints} onChange={handleChange} className="textarea bg-base-300 w-full" rows={3} placeholder='1 <= len(nums) <= 100
-1000 <= nums[i] <= 1000
' />
          </div>

          {/* Starter Code */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Starter Code (JavaScript)</label>
            <textarea name="javascriptCode" value={form.javascriptCode} onChange={handleChange} className="textarea bg-base-300 font-mono w-full" rows={6} placeholder='function countNegativeNumbers(nums) {
  // --- YOUR CODE HERE ---
}

// --- INPUT SECTION ---
const nums = JSON.parse(readline());

// --- OUTPUT SECTION ---
console.log(countNegativeNumbers(nums));
' />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Starter Code (Python)</label>
            <textarea name="pythonCode" value={form.pythonCode} onChange={handleChange} className="textarea bg-base-300 font-mono w-full" rows={6} placeholder='def countNegativeNumbers(nums):
    # --- YOUR CODE HERE ---

# --- INPUT SECTION ---
nums = eval(input())

# --- OUTPUT SECTION ---
print(countNegativeNumbers(nums))
'/>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Starter Code (Java)</label>
            <textarea name="javaCode" value={form.javaCode} onChange={handleChange} className="textarea bg-base-300 font-mono w-full" rows={6} placeholder='import java.util.*;

public class Main {
    public static int countNegativeNumbers(int[] nums) {
        // --- YOUR CODE HERE ---
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String arrStr = sc.nextLine();
        arrStr = arrStr.replaceAll("\\[|\\]", "");
        String[] parts = arrStr.split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());

        System.out.println(countNegativeNumbers(nums));
    }
}' />
          </div>

          {/* Expected Output */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Expected Output (JavaScript)</label>
            <textarea name="expectedOutputJs" value={form.expectedOutputJs} onChange={handleChange} className="textarea bg-base-300 w-full" rows={4} placeholder='2
0
3'/>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Expected Output (Python)</label>
            <textarea name="expectedOutputPy" value={form.expectedOutputPy} onChange={handleChange} className="textarea bg-base-300 w-full" rows={4} placeholder='2
0
3' />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Expected Output (Java)</label>
            <textarea name="expectedOutputJava" value={form.expectedOutputJava} onChange={handleChange} className="textarea bg-base-300 w-full" rows={4} placeholder='2
0
3'/>
          </div>

          {/* Hidden Inputs */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Hidden Inputs (one per line)</label>
            <textarea name="hiddenInputs" value={form.hiddenInputs} onChange={handleChange} className="textarea bg-base-300 w-full" rows={3} placeholder='[0, -1, 2, -5, 7]
[-10, -20, -30]
[3, 2, 1]'/>
          </div>

          <button onClick={handleSubmit} className="btn btn-primary w-full" disabled={AddProblemMutation.isPending}>
            {AddProblemMutation.isPending ? "Creating..." : "Create"}
          </button>

        </div>
    </div>
  </div>
  )
}