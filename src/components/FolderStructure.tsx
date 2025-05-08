
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Folder, FolderPlus, Edit, Trash2, File } from "lucide-react";

export interface NoteFile {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFolder {
  id: string;
  name: string;
  files: NoteFile[];
  createdAt: Date;
  updatedAt: Date;
}

interface FolderStructureProps {
  onSelectFile: (file: NoteFile, folderId: string) => void;
  currentFileId: string | null;
}

const FolderStructure: React.FC<FolderStructureProps> = ({ onSelectFile, currentFileId }) => {
  const [folders, setFolders] = useState<NoteFolder[]>([
    {
      id: "default",
      name: "Default",
      files: [
        {
          id: "welcome",
          name: "Welcome.txt",
          content: "Welcome to Notebook!",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [newFolderName, setNewFolderName] = useState("");
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isEditFolderDialogOpen, setIsEditFolderDialogOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ default: true });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const addFolder = () => {
    if (newFolderName.trim() === "") {
      toast.error("Folder name cannot be empty");
      return;
    }
    
    const newFolder: NoteFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      files: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setIsNewFolderDialogOpen(false);
    toast.success(`Folder "${newFolderName}" created`);
  };

  const updateFolderName = () => {
    if (editFolderName.trim() === "") {
      toast.error("Folder name cannot be empty");
      return;
    }
    
    if (editFolderId) {
      setFolders(folders.map(folder => 
        folder.id === editFolderId 
          ? { ...folder, name: editFolderName, updatedAt: new Date() } 
          : folder
      ));
      
      setIsEditFolderDialogOpen(false);
      setEditFolderName("");
      setEditFolderId(null);
      toast.success("Folder renamed");
    }
  };

  const deleteFolder = (folderId: string) => {
    if (folders.length === 1) {
      toast.error("Cannot delete the only folder");
      return;
    }
    
    if (confirm("Are you sure you want to delete this folder? All files in it will be lost.")) {
      setFolders(folders.filter(folder => folder.id !== folderId));
      toast.success("Folder deleted");
    }
  };

  const createNewFile = (folderId: string) => {
    const newFile: NoteFile = {
      id: `file-${Date.now()}`,
      name: "Untitled.txt",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { 
            ...folder, 
            files: [...folder.files, newFile],
            updatedAt: new Date()
          } 
        : folder
    ));
    
    // Select the newly created file
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      onSelectFile(newFile, folderId);
    }
  };

  const deleteFile = (folderId: string, fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setFolders(folders.map(folder => 
        folder.id === folderId 
          ? { 
              ...folder, 
              files: folder.files.filter(file => file.id !== fileId),
              updatedAt: new Date()
            } 
          : folder
      ));
      toast.success("File deleted");
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r overflow-auto h-full">
      <div className="p-3 flex justify-between items-center border-b">
        <h2 className="font-medium">Folders</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsNewFolderDialogOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="divide-y">
        {folders.map((folder) => (
          <div key={folder.id} className="py-1">
            <div 
              className="flex items-center px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleFolder(folder.id)}
            >
              <Folder className="h-4 w-4 mr-2 text-blue-500" />
              <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
              <div className="flex space-x-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditFolderId(folder.id);
                    setEditFolderName(folder.name);
                    setIsEditFolderDialogOpen(true);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFolder(folder.id);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            {expandedFolders[folder.id] && (
              <div className="ml-4 pl-2 border-l border-gray-200">
                {folder.files.map((file) => (
                  <div 
                    key={file.id}
                    className={`flex items-center px-3 py-1.5 hover:bg-gray-100 cursor-pointer ${
                      currentFileId === file.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onSelectFile(file, folder.id)}
                  >
                    <File className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="flex-1 text-sm truncate">{file.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(folder.id, file.id);
                      }}
                      className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  className="flex items-center px-3 py-1.5 text-xs text-blue-600 hover:bg-gray-100 w-full"
                  onClick={() => createNewFile(folder.id)}
                >
                  + New note
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-3">
            <Input 
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addFolder}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditFolderDialogOpen} onOpenChange={setIsEditFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-3">
            <Input 
              placeholder="Enter new folder name"
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditFolderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateFolderName}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderStructure;
