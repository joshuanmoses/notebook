
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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

  return (
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
  );
};

export default TextEditor;
