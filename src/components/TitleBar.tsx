
import React from "react";
import { X, Info } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              title="About"
            >
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About Notebook Password Manager</DialogTitle>
              <DialogDescription>
                <p className="mt-4">
                  Version 1.0.0
                </p>
                <p className="mt-2">
                  Developed by: Joshua N Moses
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  A secure notebook application for storing and managing your passwords.
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
    </div>
  );
};

export default TitleBar;
