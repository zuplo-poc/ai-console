// Type declarations for custom components
declare module '@/components/keys-table' {
  import { ApiKey } from '@/lib/types';
  
  export interface KeysTableProps {
    keys: ApiKey[];
    loading: boolean;
    onUpdate: (key: ApiKey) => void;
    onDelete: (key: ApiKey) => void;
    onRoll: (key: ApiKey) => void;
  }
  
  export function KeysTable(props: KeysTableProps): JSX.Element;
}

declare module '@/components/create-key-dialog' {
  import { ApiKeyFormValues } from '@/lib/types';
  
  export interface CreateKeyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ApiKeyFormValues) => void;
  }
  
  export function CreateKeyDialog(props: CreateKeyDialogProps): JSX.Element;
}

declare module '@/components/update-key-dialog' {
  import { ApiKeyUpdateFormValues } from '@/lib/types';
  
  export interface UpdateKeyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ApiKeyUpdateFormValues) => void;
    defaultValues?: Partial<ApiKeyUpdateFormValues>;
  }
  
  export function UpdateKeyDialog(props: UpdateKeyDialogProps): JSX.Element;
}

declare module '@/components/delete-key-dialog' {
  export interface DeleteKeyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    keyName: string;
    onConfirm: () => void;
  }
  
  export function DeleteKeyDialog(props: DeleteKeyDialogProps): JSX.Element;
}

declare module '@/components/roll-key-dialog' {
  export interface RollKeyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    keyName: string;
    onConfirm: () => void;
  }
  
  export function RollKeyDialog(props: RollKeyDialogProps): JSX.Element;
}
