import React from 'react'

export const Checkbox = ({ isChecked = false, onChange }) => {
  const handleChange = (e) => {
    onChange(!e.target.checked);
  };

  console.log(isChecked)
  return (
    <input
    type="checkbox"
    className="w-5 h-5 checkbox checkbox-primary border-none checked:brightness-100 bg-[#2d2424] rounded-md checked:bg-primary checked:border-base-100" 
    checked={isChecked}
    onChange={handleChange}/>
  )
}
