import React from "react";

interface CardProps {
  label: string;
  paramsInfo: string;
  data: any;
}

const Card: React.FC<CardProps> = ({ label, paramsInfo, data }) => {
  return (
    <div className="card-root bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-gray-200 hover:shadow-2xl transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl font-semibold text-gray-800">{label}</span>
      </div>
      <div className="text-xs text-gray-500 mb-1">{paramsInfo}</div>
      <div className="flex-1 min-h-[60px]">
        {data === null ? (
          <div className="text-red-400 text-xs">No data available</div>
        ) : (
          <pre className="text-xs bg-gray-100 rounded p-2 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Card;
