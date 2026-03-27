import React from "react";

function Popup({isLevel, onSelect}) {
  if (isLevel) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-content/50 backdrop-blur-sm z-50">
      <div className="bg-base-100 rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center border border-base-300">

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-base-content">
          Choose Your Level
        </h2>
        <p className="text-sm text-base-content/70 mb-6">
          This helps us show problems that match your level
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onSelect("SMP")}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-content font-semibold hover:opacity-90 transition"
          >
            Middle School (SMP)
          </button>

          <button
            onClick={() => onSelect("SMA")}
            className="flex-1 py-3 rounded-xl bg-accent text-accent-content font-semibold hover:opacity-90 transition"
          >
            High School (SMA)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;