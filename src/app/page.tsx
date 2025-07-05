"use client";

import { useEffect, useState } from "react";
import {
  Consumer,
  ApiKeyFormValues,
  ApiKeyUpdateFormValues,
} from "@/lib/types";
import { apiService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateKeyDialog } from "@/components/create-key-dialog";
import { ApplicationCard } from "@/components/application-card";
import { RefreshCwIcon } from "lucide-react";
import { ApiKeyDialog } from "@/components/api-key-dialog";

export default function Dashboard() {
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [apiKeyToShow, setApiKeyToShow] = useState<string | null>(null);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  const fetchConsumers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllKeys();

      // Check if data is an array (our service should return an array)
      if (Array.isArray(data)) {
        setConsumers(data);
      } else {
        console.error("Unexpected API response format:", data);
        toast.error("Unexpected API response format");
        setConsumers([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to fetch consumers: ${errorMessage}`);
      console.error("Error fetching consumers:", error);
      setConsumers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumers();
  }, []);

  const handleCreateKey = async (data: ApiKeyFormValues) => {
    try {
      console.log("Page: Creating consumer with data:", data);

      const result = await apiService.createConsumer({
        name: data.name,
        metadata: {
          limits: {
            // Remove budget as it's not in the type definition
            tokens: data.tokens,
            requests: data.requestLimit,
            timeWindowMinutes: data.timeWindow
              ? parseInt(data.timeWindow)
              : undefined,
          },
          model: data.model, // Model field outside limits
          budget: 0.1, // Move budget outside limits to match the expected type
        },
      });

      console.log(
        "Page: Consumer creation result:",
        JSON.stringify(result, null, 2)
      );

      // Add the new consumer to the list
      setConsumers([...consumers, result.consumer]);

      // Close the create dialog
      setIsCreateDialogOpen(false);

      // Show success message
      toast.success("Consumer created successfully");

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
        toast.error("API key was not returned from the server");
      }
    } catch (error) {
      console.error("Error creating consumer:", error);
      toast.error("Failed to create consumer");
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
        // Include the name field to preserve it in the PATCH request
        name: data.name || consumerToUpdate.name,
        metadata: {
          limits: {
            budget: 0.1, // Adding default budget
            tokens: Number(data.tokens),
            requests: Number(data.requestLimit),
            timeWindowMinutes: data.timeWindow ? Number(data.timeWindow) : 2, // Default to 2 minutes if not specified
          },
          model: data.model, // Model field outside limits
        },
      };

      console.log(
        "Sending update with data:",
        JSON.stringify(updateData, null, 2)
      );

      const updatedConsumer = await apiService.updateConsumer(
        consumerId,
        updateData
      );

      setConsumers(
        consumers.map((consumer) =>
          consumer.id === updatedConsumer.id ? updatedConsumer : consumer
        )
      );
      toast.success("Consumer updated successfully");
    } catch (error) {
      toast.error("Failed to update consumer");
      console.error(error);
    }
  };

  const handleDeleteKey = async (consumerId: string) => {
    try {
      // Find the consumer to delete
      const consumerToDelete = consumers.find((c) => c.id === consumerId);
      if (!consumerToDelete) return;

      // Pass both the ID and name to the deleteConsumer method
      await apiService.deleteConsumer(consumerId, consumerToDelete.name);
      setConsumers(consumers.filter((consumer) => consumer.id !== consumerId));
      toast.success("Consumer deleted successfully");
    } catch (error) {
      toast.error("Failed to delete consumer");
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
            <Button variant="outline" onClick={fetchConsumers}>
              <RefreshCwIcon size={16} />
              Refresh
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Application
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
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
