"use client";

import { useState, useEffect } from "react";
import {
  ApiKeyFormValues,
  ApiKeyUpdateFormValues,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CreateKeyDialog } from "@/components/create-key-dialog";
import { ApplicationCard } from "@/components/application-card";
import { RefreshCwIcon } from "lucide-react";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { useConsumers, useCreateConsumer, useUpdateConsumer, useDeleteConsumer } from "@/hooks/use-consumers";

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [apiKeyToShow, setApiKeyToShow] = useState<string | null>(null);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  // React Query hooks
  const { data: consumers = [], isLoading, isFetching, refetch } = useConsumers();
  const createConsumerMutation = useCreateConsumer();
  const updateConsumerMutation = useUpdateConsumer();
  const deleteConsumerMutation = useDeleteConsumer();

  // Debug window focus events
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused - should trigger refetch');
    };

    const handleVisibilityChange = () => {
      console.log('Visibility changed:', document.visibilityState);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleCreateKey = async (data: ApiKeyFormValues) => {
    try {
      console.log("Page: Creating consumer with data:", data);

      const result = await createConsumerMutation.mutateAsync({
        name: data.name,
        metadata: {
          limits: {
            tokens: data.tokens,
            requests: data.requestLimit,
            timeWindowMinutes: data.timeWindow
              ? parseInt(data.timeWindow)
              : undefined,
          },
          model: data.model,
          budget: data.moneyLimit ? data.moneyLimit / 1000 : 0.1,
        },
      });

      console.log(
        "Page: Consumer creation result:",
        JSON.stringify(result, null, 2)
      );

      // Close the create dialog
      setIsCreateDialogOpen(false);

      // Direct access to API key from the response structure
      let apiKey = result.apiKey;
      console.log("Page: Extracted API key:", apiKey);

      // If we don't have an API key, try to extract it from the consumer object
      if (!apiKey) {
        console.log(
          "Page: No API key found in result.apiKey, checking consumer object"
        );

        // Using type assertion to safely access potentially undefined properties
        const rawConsumer = result.consumer as unknown as Record<
          string,
          unknown
        >;

        if (
          rawConsumer &&
          typeof rawConsumer === "object" &&
          "apiKeys" in rawConsumer &&
          Array.isArray(rawConsumer.apiKeys) &&
          rawConsumer.apiKeys.length > 0 &&
          rawConsumer.apiKeys[0] &&
          typeof rawConsumer.apiKeys[0] === "object" &&
          "key" in rawConsumer.apiKeys[0]
        ) {
          apiKey = rawConsumer.apiKeys[0].key as string;
          console.log(
            "Page: Found API key directly in consumer object:",
            apiKey
          );
        }
      }

      // If we have an API key (from either source), show it in the dialog
      if (apiKey) {
        console.log("Page: Opening API key dialog with key:", apiKey);
        setApiKeyToShow(apiKey);
        setIsApiKeyDialogOpen(true);
      } else {
        console.log("Page: No API key found in any location");
      }
    } catch (error) {
      console.error("Error creating consumer:", error);
    }
  };

  const handleUpdateKey = async (
    consumerId: string,
    data: ApiKeyUpdateFormValues
  ) => {
    try {
      // Find the consumer to update
      const consumerToUpdate = consumers.find((c) => c.id === consumerId);
      if (!consumerToUpdate) return;

      // Format the data exactly as expected by the API
      const updateData = {
        name: data.name || consumerToUpdate.name,
        metadata: {
          limits: {
            budget: data.moneyLimit ? data.moneyLimit / 1000 : 0.1,
            tokens: Number(data.tokens),
            requests: Number(data.requestLimit),
            timeWindowMinutes: data.timeWindow ? Number(data.timeWindow) : 2,
          },
          model: data.model,
        },
      };

      console.log(
        "Sending update with data:",
        JSON.stringify(updateData, null, 2)
      );

      await updateConsumerMutation.mutateAsync({
        id: consumerId,
        data: updateData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteKey = async (consumerId: string) => {
    try {
      // Find the consumer to delete
      const consumerToDelete = consumers.find((c) => c.id === consumerId);
      if (!consumerToDelete) return;

      await deleteConsumerMutation.mutateAsync({
        id: consumerId,
        name: consumerToDelete.name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Zuplo AI Console</h1>
          <p className="text-sm text-muted-foreground">
            Mange your applications, set rate limits and control access to APIs.
          </p>
        </div>
        <div className="md:mt-0 mt-4 flex justify-end">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCwIcon size={16} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Application
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading applications...</p>
        </div>
      ) : consumers.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">
            No applications found. Create your first application to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {consumers.map((consumer) => (
            <ApplicationCard
              key={consumer.id}
              consumer={consumer}
              onUpdate={handleUpdateKey}
              onDelete={handleDeleteKey}
            />
          ))}
        </div>
      )}

      <CreateKeyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateKey}
      />

      <ApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onClose={() => setIsApiKeyDialogOpen(false)}
        apiKey={apiKeyToShow}
      />
    </div>
  );
}
