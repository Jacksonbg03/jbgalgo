import React from 'react'
import { Checkbox } from "../components/Checkbox";

export function FilterSection({ title, options, filters, onChange }) {
  return (
    <div className="mb-6 border-b border-[#dbdbdb]/30 pb-4">
      <h4 className="text-[14px] font-bold mb-2 text-[#dbdbdb]">{title}</h4>
      {options.map((opt) => (
        <div key={opt.value} className="flex gap-2 py-1 items-center">
          <Checkbox
            isChecked={filters[opt.type][opt.value]}
            onChange={() => onChange(opt.type, opt.value)}
          />
          <span className="text-[14px] font-medium">{opt.label}</span>
        </div>
      ))}
    </div>
  );
}
