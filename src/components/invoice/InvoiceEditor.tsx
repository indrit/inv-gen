'use client';

import { useInvoiceEditor } from '@/hooks/use-invoice-editor';
import SharedEditor from '@/components/shared/editor/SharedEditor';

export default function InvoiceEditor({ clientId }: { clientId?: string }) {
  const hook = useInvoiceEditor(clientId ?? null);

  return <SharedEditor type="invoice" hook={hook} />;
}
