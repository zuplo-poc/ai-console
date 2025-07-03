"use client";

import { useState } from "react";
import { Consumer } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpdateKeyDialog } from "@/components/update-key-dialog";
import { DeleteKeyDialog } from "@/components/delete-key-dialog";
import {
  CoinsIcon,
  SquarePenIcon,
  TrashIcon,
  TrendingUpIcon,
} from "lucide-react";
import { AreaChartHero as SampleChart } from "@/app/SampleChart";
import { DonutChartHero } from "@/app/SampleDonut";

interface ApplicationCardProps {
  consumer: Consumer;
  onUpdate: (consumerId: string, data: any) => Promise<void>;
  onDelete: (consumerId: string) => Promise<void>;
}

export function ApplicationCard({
  consumer,
  onUpdate,
  onDelete,
}: ApplicationCardProps) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between">
          <CardTitle className="text-xl font-bold">
            {consumer.name}

            <CardDescription>
              <div className="flex gap-2">
                <ul className="flex w-full divide-x divide-gray-300">
                  <li className="flex items-center pe-10">
                    <span className="text-sm font-medium whitespace-nowrap">
                      Created{" "}
                      {new Date(consumer.createdOn).toLocaleDateString()}
                    </span>
                  </li>
                  <li className="flex items-center px-10">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <TrendingUpIcon size={16} />
                      Requests
                      <div>
                        {consumer.metadata?.limits?.requests || 0} /{" "}
                        {consumer.metadata?.limits?.timeWindowMinutes || 1} min
                      </div>
                    </span>
                  </li>
                  <li className="flex items-center px-10">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <CoinsIcon size={16} />
                      <div>
                        Tokens {consumer.metadata?.limits?.tokens || 0} / day
                      </div>
                    </span>
                  </li>
                </ul>
              </div>
            </CardDescription>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUpdateDialogOpen(true)}
            >
              <SquarePenIcon size={16} />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <TrashIcon size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Requests</h3>
              <SampleChart />
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">$</h3>
              <SampleChart />
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Tokens</h3>
              <div className="flex justify-center items-center h-full">
                <DonutChartHero />
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
          requestLimit:
            consumer.metadata?.limits?.requests || consumer.metadata?.rateLimit,
          tokens: consumer.metadata?.limits?.tokens,
          timeWindow: consumer.metadata?.limits?.timeWindowMinutes?.toString(),
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
