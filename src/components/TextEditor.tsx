import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface TextEditorProps {
  content: string;
  setContent: (content: string) => void;
  wordWrap: boolean;
  fontFamily: string;
  onCursorPositionChange: (line: number, column: number) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  content,
  setContent,
  wordWrap,
  fontFamily,
  onCursorPositionChange,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  useEffect(() => {
    const updateCursorPosition = () => {
      if (!textAreaRef.current) return;
      
      const textarea = textAreaRef.current;
      const cursorPos = textarea.selectionStart;
      
      // Calculate line and column from cursor position
      const textBeforeCursor = textarea.value.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      const lineNumber = lines.length;
      const columnNumber = lines[lines.length - 1].length + 1;
      
      onCursorPositionChange(lineNumber, columnNumber);
    };

    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.addEventListener('click', updateCursorPosition);
      textarea.addEventListener('keyup', updateCursorPosition);
      
      // Initial cursor position
      updateCursorPosition();
      
      return () => {
        textarea.removeEventListener('click', updateCursorPosition);
        textarea.removeEventListener('keyup', updateCursorPosition);
      };
    }
  }, [onCursorPositionChange]);

  // Handle paste events for images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || !textAreaRef.current) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault(); // Prevent default paste behavior
          
          const blob = items[i].getAsFile();
          if (!blob) continue;
          
          const reader = new FileReader();
          reader.onload = (event) => {
            const imgBase64 = event.target?.result as string;
            const imageMarkdown = `![Image](${imgBase64})`;
            
            const currentPosition = textAreaRef.current!.selectionStart;
            const newContent = 
              content.substring(0, currentPosition) +
              imageMarkdown +
              content.substring(currentPosition);
            
            setContent(newContent);
          };
          reader.readAsDataURL(blob);
          break; // Only handle the first image
        }
      }
    };
    
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [content, setContent]);

  const handleInsertImage = () => {
    setImageDialogOpen(true);
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl && textAreaRef.current) {
      const currentPosition = textAreaRef.current.selectionStart;
      const imageMarkdown = `![Image](${imageUrl})`;
      
      const newContent = 
        content.substring(0, currentPosition) +
        imageMarkdown +
        content.substring(currentPosition);
      
      setContent(newContent);
      setImageDialogOpen(false);
      setImageUrl("");
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && textAreaRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgBase64 = event.target?.result as string;
        const imageMarkdown = `![Image](${imgBase64})`;
        
        const currentPosition = textAreaRef.current!.selectionStart;
        const newContent = 
          content.substring(0, currentPosition) +
          imageMarkdown +
          content.substring(currentPosition);
        
        setContent(newContent);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    if (!content) return null;

    const parts = [];
    const regex = /!\[.*?\]\((.*?)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      // Add the image
      const imageUrl = match[1];
      parts.push(
        <img 
          key={match.index} 
          src={imageUrl} 
          alt="Embedded" 
          className="max-w-full my-2" 
          style={{ maxHeight: '300px' }}
        />
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  // Add event handler for the editable div to support paste events
  const handleEditorPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault(); // Prevent default paste behavior
        
        const blob = items[i].getAsFile();
        if (!blob) continue;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgBase64 = event.target?.result as string;
          const imageMarkdown = `![Image](${imgBase64})`;
          
          // Get current selection position in the contentEditable div
          const selection = window.getSelection();
          const range = selection?.getRangeAt(0);
          
          if (range) {
            // Insert image markdown at cursor position
            range.deleteContents();
            const textNode = document.createTextNode(imageMarkdown);
            range.insertNode(textNode);
            
            // Update content state
            if (document.querySelector('[contenteditable="true"]')) {
              const editableDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
              setContent(editableDiv.innerText);
            }
          }
        };
        reader.readAsDataURL(blob);
        break; // Only handle the first image
      }
    }
  };

  return (
    <div className="relative h-full">
      <div className="absolute right-2 top-2 z-10">
        <Button 
          onClick={handleInsertImage} 
          variant="outline" 
          size="sm"
          title="Insert Image"
        >
          <Image size={16} />
        </Button>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button onClick={handleImageUpload} variant="secondary">
                  Upload Image
                </Button>
                <Button onClick={handleImageUrlSubmit}>
                  Insert
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="w-full h-full overflow-auto">
        <div className="hidden">
          <textarea
            ref={textAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "w-full h-full resize-none outline-none p-2 bg-white",
              !wordWrap && "whitespace-pre overflow-x-auto"
            )}
            style={{
              fontFamily,
              lineHeight: "1.5"
            }}
          />
        </div>
        
        <div 
          className={cn(
            "w-full h-full resize-none outline-none p-2 bg-white",
            !wordWrap && "whitespace-pre overflow-x-auto"
          )}
          style={{
            fontFamily,
            lineHeight: "1.5"
          }}
          contentEditable
          onPaste={handleEditorPaste}
          onInput={(e) => {
            const target = e.currentTarget;
            setContent(target.innerText);
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
