'use client';

import { useEstimateEditor } from '@/hooks/use-estimate-editor';
import SharedEditor from '@/components/shared/editor/SharedEditor';

export default function EstimateEditor({ clientId }: { clientId?: string }) {
  const hook = useEstimateEditor(clientId ?? null);

  return <SharedEditor type="estimate" hook={hook} />;
}
