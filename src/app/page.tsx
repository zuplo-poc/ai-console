"use client";

import { useEffect, useState } from "react";
import { Consumer, ApiKeyFormValues, ApiKeyUpdateFormValues } from "@/lib/types";
import { apiService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CreateKeyDialog } from "@/components/create-key-dialog";
import { ApplicationCard } from "@/components/application-card";

export default function Dashboard() {
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchConsumers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllKeys();
      
      // Check if data is an array (our service should return an array)
      if (Array.isArray(data)) {
        setConsumers(data);
      } else {
        console.error('Unexpected API response format:', data);
        toast.error('Unexpected API response format');
        setConsumers([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to fetch consumers: ${errorMessage}`);
      console.error('Error fetching consumers:', error);
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
      const newConsumer = await apiService.createConsumer({
        name: data.name,
        metadata: {
          limits: {
            tokens: data.tokens,
            requests: data.requestLimit,
            timeWindowMinutes: data.timeWindow ? parseInt(data.timeWindow) : undefined
          }
        }
      });
      setConsumers([...consumers, newConsumer]);
      toast.success("Consumer created successfully");
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create consumer");
      console.error(error);
    }
  };

  const handleUpdateKey = async (consumerId: string, data: ApiKeyUpdateFormValues) => {
    try {
      // Find the consumer to update
      const consumerToUpdate = consumers.find(c => c.id === consumerId);
      if (!consumerToUpdate) return;
      
      // Format the data exactly as expected by the API
      const updateData = {
        // Include the name field to preserve it in the PATCH request
        name: data.name || consumerToUpdate.name,
        metadata: {
          limits: {
            tokens: Number(data.tokens),
            requests: Number(data.requestLimit),
            timeWindowMinutes: data.timeWindow ? Number(data.timeWindow) : 2 // Default to 2 minutes if not specified
          }
        }
      };
      
      console.log('Sending update with data:', JSON.stringify(updateData, null, 2));
      
      const updatedConsumer = await apiService.updateConsumer(consumerId, updateData);
      
      setConsumers(consumers.map(consumer => consumer.id === updatedConsumer.id ? updatedConsumer : consumer));
      toast.success("Consumer updated successfully");
    } catch (error) {
      toast.error("Failed to update consumer");
      console.error(error);
    }
  };

  const handleDeleteKey = async (consumerId: string) => {
    try {
      // Find the consumer to delete
      const consumerToDelete = consumers.find(c => c.id === consumerId);
      if (!consumerToDelete) return;
      
      // Pass both the ID and name to the deleteConsumer method
      await apiService.deleteConsumer(consumerId, consumerToDelete.name);
      setConsumers(consumers.filter(consumer => consumer.id !== consumerId));
      toast.success("Consumer deleted successfully");
    } catch (error) {
      toast.error("Failed to delete consumer");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Zuplo AI Console</CardTitle>
          <CardDescription>
            Manage your applications, set rate limits, and control access to APIs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsCreateDialogOpen(true)}>Create New Application</Button>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <p>Loading applications...</p>
            </div>
          ) : consumers.length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <p className="text-muted-foreground">No applications found. Create your first application to get started.</p>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">{consumers.length} applications found</p>
          <Button variant="outline" onClick={fetchConsumers}>Refresh</Button>
        </CardFooter>
      </Card>

      <CreateKeyDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSubmit={handleCreateKey} 
      />
    </div>
  );
}
