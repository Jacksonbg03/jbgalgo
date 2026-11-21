import { BugIcon, CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";

// errors from the code runner service or our own rate limit, not from the student's code
const isServerBusy = (error) =>
  /^(Code runner|Failed to execute code|Too many runs|Your previous run|Failed to run code)/.test(error || "");

function OutputPanel({ output, error, isCorrect, solved, handleProblemChange, nextProb}) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output.length === 0 && !error ? (
          <p className="text-base-content/50 text-[16px]">Click "Run Code" to see the output here...</p>
        ) : output && isCorrect && solved ? (
          <>
            <div className="w-full bg-green-600 rounded-md py-6 px-7 mb-5 mt-3 flex items-center">
              <div className="w-[80%] leading-6">
                <h1 className="flex items-center gap-2 text-[22px] text-white mb-2 font-semibold font-poppins"><CheckCircle2Icon className="size-6" /> Accepted</h1>
                <p className="text-white text-[14px]">All test cases passed.</p>
              </div>
              <div className="w-[20%] text-end">
                {nextProb.length ? (<button className="btn bg-white btn-sm gap-2 text-black" onClick={()=>handleProblemChange(nextProb)}>Next Problem</button>) : ""}
              </div>
            </div>
            {output.map((o, i) => {
              return(
                <div className="w-full">
                  <h3 className="text-[14px] mb-1">Your Output</h3>
                  <div className="card bg-base-200 mb-2 !rounded-md w-full flex flex-row items-center justify-between">
                    <div className="w-[2%] border-r py-2 px-3 flex items-center justify-center">
                      <h1 className="text-[12px] opacity-55 font-mono">{i+1}</h1>
                    </div>
                    <div className="w-[98%] py-2 px-3 font-mono">
                      {o}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        ) : output && !isCorrect && !error? (
          <div>
            {(output || error) && isCorrect == false  && (
              <>
                <h1 className="flex items-center gap-2 text-2xl text-red-400 mb-1 font-medium font-poppins"><XCircleIcon className="size-6" /> Wrong Answer</h1>
                <p className="text-base-content/70 mb-3">Compare your output with the examples in the problem description.</p>
                  {output.map((o, i) => {
                    return(
                      <div className="w-full">
                        <h3 className="text-[14px] mb-1">Your Output</h3>
                        <div className="card bg-base-200 mb-2 !rounded-md w-full flex flex-row items-center justify-between">
                          <div className="w-[2%] border-r py-2 px-3 flex items-center justify-center">
                            <h1 className="text-[12px] opacity-55 font-mono">{i+1}</h1>
                          </div>
                          <div className="w-[98%] py-2 px-3 font-mono">
                            {o}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </>
            )}
          </div>
        ) : isServerBusy(error) ? (
          <div className="w-full">
            <h1 className="flex items-center gap-2 text-2xl text-warning mb-3 font-medium font-poppins"><ClockIcon className="size-6" /> Server is busy</h1>
            <p className="text-base-content/70">
              Many students are running code at the same time. This is not a problem with your code. Wait a few seconds, then click "Run Code" again.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <h1 className="flex items-center gap-2 text-2xl text-red-400 mb-3 font-medium font-poppins"><BugIcon className="size-6" /> Error</h1>
            <p className="text-base-content/70 mb-3">Read the message below. It usually includes the line number where the error is.</p>
            <div className="card bg-base-200 mb-2 !rounded-md w-full flex flex-row items-center justify-between">
              <pre className="text-sm font-mono py-2 px-3 whitespace-pre-wrap">{error}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
