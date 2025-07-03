"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RollKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  keyName: string;
}

export function RollKeyDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  keyName 
}: RollKeyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Roll API Key
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to roll (regenerate) the API key &ldquo;{keyName}&rdquo;? The current key will be invalidated and a new key will be generated. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm}>
            Roll Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
