"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string | null;
}

export function ApiKeyDialog({ isOpen, onClose, apiKey }: ApiKeyDialogProps) {
  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success("API key copied to clipboard");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">API Key Created</DialogTitle>
          <DialogDescription className="text-red-500 font-medium">
            This is the only time you&apos;ll see this API key. Copy it now!
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-gray-100 rounded-md mt-2 mb-4">
          <code className="text-sm block w-full overflow-x-auto whitespace-pre-wrap break-all font-mono">
            {apiKey || "No API key available"}
          </code>
        </div>
        <DialogFooter className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            This key will not be shown again
          </p>
          <Button onClick={handleCopy} disabled={!apiKey}>
            Copy to Clipboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
