"use client";

import { useEffect } from "react";
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
import { ApiKeyUpdateFormValues } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  requestLimit: z.number().optional(),
  tokens: z.number().optional(),
  timeWindow: z.string().optional(),
  model: z.string().optional(),
  moneyLimit: z.number().optional()
});

interface UpdateKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ApiKeyUpdateFormValues) => void;
  defaultValues: ApiKeyUpdateFormValues;
}

export function UpdateKeyDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  defaultValues 
}: UpdateKeyDialogProps) {

  
  const form = useForm<ApiKeyUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      requestLimit: 100,
      tokens: 1000,
      timeWindow: "1440",
      model: "gpt-4o",
      moneyLimit: 1000
    },
  });

  // Update form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name || "",
        requestLimit: defaultValues.requestLimit,
        tokens: defaultValues.tokens,
        timeWindow: defaultValues.timeWindow || "",
        model: defaultValues.model,
        moneyLimit: defaultValues.moneyLimit
      });
    }
  }, [defaultValues, form]);



  const handleSubmit = (data: ApiKeyUpdateFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Application</DialogTitle>
          <DialogDescription>
            Update the application settings.
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
              name="moneyLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Money Limit ($)</FormLabel>
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
                  <FormLabel>Time Window</FormLabel>
                  <FormControl>
                    <Input placeholder="1h" {...field} />
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
              <Button type="submit">Update Application</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
