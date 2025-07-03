"use client";

import { ApiKey } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface KeysTableProps {
  keys: ApiKey[];
  loading: boolean;
  onUpdate: (key: ApiKey) => void;
  onDelete: (key: ApiKey) => void;
  onRoll: (key: ApiKey) => void;
}

export function KeysTable({ keys, loading, onUpdate, onDelete, onRoll }: KeysTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Request Limit</TableHead>
            <TableHead>Tokens</TableHead>
            <TableHead>Time Window</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Loading...
              </TableCell>
            </TableRow>
          ) : keys.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                No API keys found. Create your first key to get started.
              </TableCell>
            </TableRow>
          ) : (
            keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell className="font-mono text-xs">
                  {key.key.substring(0, 10)}...
                </TableCell>
                <TableCell>{key.metadata?.requestLimit || "—"}</TableCell>
                <TableCell>{key.metadata?.tokens || "—"}</TableCell>
                <TableCell>{key.metadata?.timeWindow || "—"}</TableCell>
                <TableCell>{formatDate(key.createdAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdate(key)}
                    title="Edit key"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRoll(key)}
                    title="Roll key"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(key)}
                    title="Delete key"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
