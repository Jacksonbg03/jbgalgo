import React from 'react'
import Navbar from '../components/Navbar'
import { Code2Icon } from 'lucide-react'

export const AddProblemPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* HEADER */}
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

            <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* PROBLEM LIST */}
            <div className="w-full space-y-4">
                <div className="card bg-base-100 hover:scale-[1.01] transition-transform">
                    <div className="card-body">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* LEFT SIDE */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="input-field w-full">
                                <h2 className='text-[16px]'>Title</h2>
                                <input type="text" placeholder="Enter title" className="input bg-base-300 w-full mt-1 border-[#868686] focus:border-[#fff] focus:outline-none" />
                            </div>
                            <div className="input-field w-full">
                                <h2 className='text-[16px]'>Difficulty</h2>
                                <input type="text" placeholder="Enter title" className="input bg-base-300 w-full mt-1 border-[#868686] focus:border-[#fff] focus:outline-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
