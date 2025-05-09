
import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface TitleBarProps {
  fileName: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ fileName }) => {
  const displayName = fileName || "Untitled";
  
  const handleClose = () => {
    if (window.confirm("Are you sure you want to close this notebook?")) {
      window.close();
    }
  };
  
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-200 border-b">
      <h1 className="text-sm font-medium">
        {displayName} - Notebook Password Manager
      </h1>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 w-6 p-0" 
        onClick={handleClose}
        title="Close"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TitleBar;
