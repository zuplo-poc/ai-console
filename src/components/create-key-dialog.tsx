"use client";


import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiKeyFormValues } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  requestLimit: z.number().optional(),
  tokens: z.number().optional(),
  timeWindow: z.string().optional(),
  model: z.string().optional()
});

interface CreateKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ApiKeyFormValues) => void;
}

export function CreateKeyDialog({ open, onOpenChange, onSubmit }: CreateKeyDialogProps) {

  
  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      requestLimit: undefined,
      tokens: undefined,
      timeWindow: "",
      model: undefined
    },
  });



  const handleSubmit = (data: ApiKeyFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Application</DialogTitle>
          <DialogDescription>
            Create a new application with optional rate limiting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Limit</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tokens</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="1000" 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeWindow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Window (minutes)</FormLabel>
                  <FormControl>
                    <Input placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gemini-2.0-flash-exp">gemini-2.0-flash-exp</SelectItem>
                      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Create Application</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
