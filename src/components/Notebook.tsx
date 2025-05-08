
import React, { useState, useEffect } from "react";
import TitleBar from "@/components/TitleBar";
import MenuBar from "@/components/MenuBar";
import TextEditor from "@/components/TextEditor";
import StatusBar from "@/components/StatusBar";
import FolderStructure from "@/components/FolderStructure";
import { NoteFile } from "@/components/FolderStructure";
import useFileOperations from "@/hooks/useFileOperations";

const Notebook: React.FC = () => {
  const {
    content,
    setContent,
    fileName,
    setFileName,
    encoding,
    newFile,
    openFile,
    saveFile
  } = useFileOperations("");
  
  const [wordWrap, setWordWrap] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [fontFamily, setFontFamily] = useState("Consolas");
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const handleCursorPositionChange = (line: number, column: number) => {
    setCursorPosition({ line, column });
  };

  const handleSelectFile = (file: NoteFile, folderId: string) => {
    // Check if there are unsaved changes first
    if (content && currentFileId && !confirm("Do you want to save changes to the current file?")) {
      return;
    }
    
    setContent(file.content);
    setFileName(file.name);
    setCurrentFileId(file.id);
    setCurrentFolderId(folderId);
  };

  return (
    <div className="flex flex-col h-screen">
      <TitleBar fileName={fileName} />
      <MenuBar
        fileName={fileName}
        content={content}
        setContent={setContent}
        wordWrap={wordWrap}
        setWordWrap={setWordWrap}
        showStatusBar={showStatusBar}
        setShowStatusBar={setShowStatusBar}
        setFontFamily={setFontFamily}
        fontFamily={fontFamily}
        saveFile={saveFile}
        openFile={openFile}
        newFile={newFile}
      />
      <div className="flex flex-1 overflow-hidden">
        <FolderStructure 
          onSelectFile={handleSelectFile}
          currentFileId={currentFileId}
        />
        <div className="flex-1 overflow-hidden">
          <TextEditor
            content={content}
            setContent={setContent}
            wordWrap={wordWrap}
            fontFamily={fontFamily}
            onCursorPositionChange={handleCursorPositionChange}
          />
        </div>
      </div>
      {showStatusBar && (
        <StatusBar
          line={cursorPosition.line}
          column={cursorPosition.column}
          encoding={encoding}
        />
      )}
    </div>
  );
};

export default Notebook;
