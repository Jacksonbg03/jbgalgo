function OutputPanel({ output, error, isCorrect}) {
  console.log(output)
  console.log(error)
  console.log(isCorrect)
  console.log(output.length)
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output.length === 0 ? (
          <p className="text-base-content/50 text-[20px]">Click "Run Code" to see the output here...</p>
        ) : output && isCorrect ? (
          <>
            <h1 className="text-2xl text-green-400 mb-3 font-medium font-poppins">Congratulations!</h1> 
            {output.map((o, i) => {
              return(
                <div className="w-full">
                  <h3 className="text-[14px] mb-1">Your Output (stdout)</h3>
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
                <h1 className="text-2xl text-red-400 mb-3 font-medium font-poppins">Wrong Answer :(</h1>
                  {output.map((o, i) => {
                    return(
                      <div className="w-full">
                        <h3 className="text-[14px] mb-1">Your Output (stdout)</h3>
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
        ) : (
          <div className="w-full">
            <h1 className="text-2xl text-red-400 mb-3 font-medium font-poppins">Compilation Error !</h1>
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
