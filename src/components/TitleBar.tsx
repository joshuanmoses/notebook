
import React from "react";

interface TitleBarProps {
  fileName: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ fileName }) => {
  const displayName = fileName || "Untitled";
  
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-200 border-b">
      <h1 className="text-sm font-medium">
        {displayName} - Notebook
      </h1>
    </div>
  );
};

export default TitleBar;
