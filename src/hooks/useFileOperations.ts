
import { useState } from "react";
import { toast } from "sonner";

const useFileOperations = (initialContent = "") => {
  const [content, setContent] = useState<string>(initialContent);
  const [fileName, setFileName] = useState<string>("");
  const [encoding, setEncoding] = useState<string>("UTF-8");
  const [isModified, setIsModified] = useState<boolean>(false);
  
  // Update content and mark as modified
  const updateContent = (newContent: string) => {
    setContent(newContent);
    setIsModified(true);
  };

  // Create new file
  const newFile = () => {
    if (isModified && confirm("Do you want to save changes?")) {
      saveFile();
    }
    
    setContent("");
    setFileName("");
    setEncoding("UTF-8");
    setIsModified(false);
    toast.success("New file created");
  };

  // Open file
  const openFile = () => {
    // In a real app, we would use a file dialog
    // For this demo, we'll simulate it
    if (isModified && confirm("Do you want to save changes?")) {
      saveFile();
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.js,.ts,.html,.css';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            setContent(result);
            setFileName(file.name);
            setIsModified(false);
            toast.success(`Opened ${file.name}`);
          }
        };
        
        reader.onerror = () => {
          toast.error("Error reading file");
        };
        
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  // Save file
  const saveFile = () => {
    // In a real app, we would use a file dialog
    // For this demo, we'll simulate it with a download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = fileName || 'untitled.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsModified(false);
    if (!fileName) {
      setFileName('untitled.txt');
    }
    
    toast.success(`Saved as ${fileName || 'untitled.txt'}`);
  };

  return { 
    content, 
    setContent: updateContent, 
    fileName, 
    setFileName, 
    encoding,
    setEncoding,
    isModified,
    newFile,
    openFile,
    saveFile
  };
};

export default useFileOperations;
