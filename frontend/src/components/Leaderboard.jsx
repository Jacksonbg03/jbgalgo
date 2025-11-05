import React from 'react'
import { Trophy } from "lucide-react";
import { Medal } from './Medal';

export const Leaderboard = ({ data }) => {
  console.log(data)
  return (
    <div className="card bg-base-100 border-2 border-primary/20 hover:border-primary/40 mt-8">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-accent to-secondary rounded-xl">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black">Top Coders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full border border-primary/20">
            <thead className='h-18 text-[18px]'>
              <tr className="bg-primary/60 text-[#cfcfcf]">
                <th className="text-left w-[15%]"><p className="ml-5.5">#</p></th>
                <th className="text-left">Name</th>
                <th className="text-center">Total</th>
                <th className="text-center">Easy</th>
                <th className="text-center">Medium</th>
                <th className="text-center">Hard</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-base-content/70">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((user, index) => (
                  <tr key={index} className="hover:bg-primary/10 rounded-lg">
                    <td>
                      {[1, 2, 3].includes(index + 1) ? <Medal rank={index+1} size={35} /> : (
                        <div className='h-[43px] w-full items-center flex'>
                          <span className='ml-5.5'>{index+1}</span>
                        </div>
                        )}
                    </td>
                    <td className="align-middle p-0">
                      <div className="grid items-center h-full">
                        <div className="flex items-center gap-3 px-3 py-2">
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{user.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{user.totalSolved}</td>
                    <td className="text-center">{user.easy}</td>
                    <td className="text-center">{user.medium}</td>
                    <td className="text-center">{user.hard}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}