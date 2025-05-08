
import React from "react";

interface StatusBarProps {
  line: number;
  column: number;
  encoding: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ line, column, encoding }) => {
  return (
    <div className="flex justify-between items-center px-4 py-1 text-xs text-gray-600 bg-gray-100 border-t">
      <div>
        Ln {line}, Col {column}
      </div>
      <div>
        {encoding}
      </div>
    </div>
  );
};

export default StatusBar;
