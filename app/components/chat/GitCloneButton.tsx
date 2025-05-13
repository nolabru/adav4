import type { Message } from 'ai';
import type { IChatMetadata } from '~/lib/persistence/db';

interface GitCloneButtonProps {
  _className?: string;
  _importChat?: (description: string, messages: Message[], metadata?: IChatMetadata) => Promise<void>;
}

export default function GitCloneButton({ _importChat, _className }: GitCloneButtonProps) {
  // Return an empty fragment instead of null to maintain component structure
  return <>{/* Button removed but component structure maintained */}</>;
}
