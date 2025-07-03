"use client";

import { useState } from "react";
import { Consumer } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpdateKeyDialog } from "@/components/update-key-dialog";
import { DeleteKeyDialog } from "@/components/delete-key-dialog";

interface ApplicationCardProps {
  consumer: Consumer;
  onUpdate: (consumerId: string, data: any) => Promise<void>;
  onDelete: (consumerId: string) => Promise<void>;
}

export function ApplicationCard({ consumer, onUpdate, onDelete }: ApplicationCardProps) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdateKey = async (data: any) => {
    await onUpdate(consumer.id, data);
    setIsUpdateDialogOpen(false);
  };

  const handleDeleteKey = async () => {
    await onDelete(consumer.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="bg-slate-50 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{consumer.name}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsUpdateDialogOpen(true)}
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left side: Application settings */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Quotas:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-sm font-medium">
                  {consumer.metadata?.limits?.requests || 0} requests / {consumer.metadata?.limits?.timeWindowMinutes || 1} min
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-sm font-medium">
                  {consumer.metadata?.limits?.tokens || 0} tokens / day
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-sm font-medium">
                  Created: {new Date(consumer.createdOn).toLocaleDateString()}
                </span>
              </li>
            </ul>
          </div>
          
          {/* Right side: Charts */}
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Requests</h3>
              <div className="h-32 flex items-center justify-center bg-slate-50 rounded">
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span className="text-xs text-gray-500 mt-2">Chart will appear here</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Tokens</h3>
              <div className="h-32 flex items-center justify-center bg-slate-50 rounded">
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                  <span className="text-xs text-gray-500 mt-2">Chart will appear here</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">$</h3>
              <div className="h-32 flex items-center justify-center bg-slate-50 rounded">
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-xs text-gray-500 mt-2">Chart will appear here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Dialogs */}
      <UpdateKeyDialog 
        open={isUpdateDialogOpen} 
        onOpenChange={setIsUpdateDialogOpen} 
        onSubmit={handleUpdateKey}
        defaultValues={{
          name: consumer.name,
          requestLimit: consumer.metadata?.limits?.requests || consumer.metadata?.rateLimit,
          tokens: consumer.metadata?.limits?.tokens,
          timeWindow: consumer.metadata?.limits?.timeWindowMinutes?.toString()
        }}
      />

      <DeleteKeyDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        onConfirm={handleDeleteKey}
        keyName={consumer.name}
      />
    </Card>
  );
}
