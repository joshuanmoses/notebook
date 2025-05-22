
import React from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface MenuBarProps {
  fileName: string;
  content: string;
  setContent: (content: string) => void;
  wordWrap: boolean;
  setWordWrap: (wordWrap: boolean) => void;
  showStatusBar: boolean;
  setShowStatusBar: (showStatusBar: boolean) => void;
  setFontFamily: (fontFamily: string) => void;
  fontFamily: string;
  saveFile: () => void;
  openFile: () => void;
  newFile: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  fileName,
  content,
  setContent,
  wordWrap,
  setWordWrap,
  showStatusBar,
  setShowStatusBar,
  setFontFamily,
  fontFamily,
  saveFile,
  openFile,
  newFile,
}) => {
  const [findDialogOpen, setFindDialogOpen] = React.useState(false);
  const [findText, setFindText] = React.useState("");
  const [replaceText, setReplaceText] = React.useState("");
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [fontDialogOpen, setFontDialogOpen] = React.useState(false);
  
  // Available fonts for our simple editor
  const availableFonts = [
    "Consolas",
    "Courier New",
    "monospace",
    "Arial",
    "Verdana",
    "Times New Roman",
  ];

  const handleFind = () => {
    if (!findText) return;
    
    const searchText = caseSensitive ? findText : findText.toLowerCase();
    const documentText = caseSensitive ? content : content.toLowerCase();
    
    if (documentText.includes(searchText)) {
      toast.success(`Found "${findText}"`);
    } else {
      toast.error(`Could not find "${findText}"`);
    }
  };

  const handleReplace = () => {
    if (!findText) return;
    
    const searchText = caseSensitive ? findText : findText.toLowerCase();
    let newContent = content;
    
    if (caseSensitive) {
      newContent = content.replace(findText, replaceText);
    } else {
      const regex = new RegExp(findText, 'gi');
      newContent = content.replace(regex, replaceText);
    }
    
    if (newContent !== content) {
      setContent(newContent);
      toast.success(`Replaced "${findText}" with "${replaceText}"`);
    } else {
      toast.error(`Could not find "${findText}"`);
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    
    const searchText = caseSensitive ? findText : findText.toLowerCase();
    let newContent = content;
    
    if (caseSensitive) {
      newContent = content.split(findText).join(replaceText);
    } else {
      const regex = new RegExp(findText, 'gi');
      newContent = content.replace(regex, replaceText);
    }
    
    if (newContent !== content) {
      setContent(newContent);
      toast.success(`Replaced all instances of "${findText}" with "${replaceText}"`);
    } else {
      toast.error(`Could not find "${findText}"`);
    }
  };

  const insertDateTime = () => {
    const now = new Date();
    const formattedDateTime = now.toLocaleString();
    setContent(content + formattedDateTime);
  };

  return (
    <div className="flex items-center p-1 bg-gray-100 border-b select-none">
      <div className="flex space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="px-2 py-1 hover:bg-gray-200 rounded">
            File
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={newFile}>New</DropdownMenuItem>
            <DropdownMenuItem onClick={openFile}>Open...</DropdownMenuItem>
            <DropdownMenuItem onClick={saveFile}>Save</DropdownMenuItem>
            <Separator />
            <DropdownMenuItem onClick={() => window.print()}>Print...</DropdownMenuItem>
            <Separator />
            <DropdownMenuItem onClick={() => window.close()}>Exit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="px-2 py-1 hover:bg-gray-200 rounded">
            Edit
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={() => document.execCommand("undo")}
            >
              Undo
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem 
              onClick={() => document.execCommand("cut")}
            >
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => document.execCommand("copy")}
            >
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => document.execCommand("paste")}
            >
              Paste
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => document.execCommand("delete")}
            >
              Delete
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem 
              onClick={() => setFindDialogOpen(true)}
            >
              Find...
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setFindDialogOpen(true)}
            >
              Replace...
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem 
              onClick={() => document.execCommand("selectAll")}
            >
              Select All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertDateTime}>
              Time/Date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="px-2 py-1 hover:bg-gray-200 rounded">
            Format
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setWordWrap(!wordWrap)}>
              Word Wrap {wordWrap ? "✓" : ""}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontDialogOpen(true)}>
              Font...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="px-2 py-1 hover:bg-gray-200 rounded">
            View
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowStatusBar(!showStatusBar)}>
              Status Bar {showStatusBar ? "✓" : ""}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="px-2 py-1 hover:bg-gray-200 rounded">
            Help
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => toast.info("Notebook - A simple text editor by Joshua N Moses")}>
              About Notebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Find/Replace Dialog */}
      <Dialog open={findDialogOpen} onOpenChange={setFindDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find and Replace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="find">Find:</Label>
              <Input 
                id="find" 
                value={findText} 
                onChange={(e) => setFindText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replace">Replace with:</Label>
              <Input 
                id="replace" 
                value={replaceText} 
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="case-sensitive" 
                checked={caseSensitive} 
                onCheckedChange={(checked) => setCaseSensitive(!!checked)} 
              />
              <Label htmlFor="case-sensitive">Match case</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={handleFind}>Find</Button>
              <Button onClick={handleReplace}>Replace</Button>
              <Button onClick={handleReplaceAll}>Replace All</Button>
              <Button variant="outline" onClick={() => setFindDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Font Dialog */}
      <Dialog open={fontDialogOpen} onOpenChange={setFontDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Font</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Font</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableFonts.map((font) => (
                  <Button
                    key={font}
                    variant={fontFamily === font ? "default" : "outline"}
                    onClick={() => setFontFamily(font)}
                    className="justify-start"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setFontDialogOpen(false)}>OK</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuBar;
