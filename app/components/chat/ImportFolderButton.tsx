import React from 'react';
import type { Message } from 'ai';

interface ImportFolderButtonProps {
  _className?: string;
  _importChat?: (description: string, messages: Message[]) => Promise<void>;
}

export const ImportFolderButton: React.FC<ImportFolderButtonProps> = ({ _className, _importChat }) => {
  // Return empty elements instead of null to maintain component structure
  return (
    <>
      <input type="file" id="folder-import" className="hidden" webkitdirectory="" directory="" {...({} as any)} />
      {/* Button removed but component structure maintained */}
    </>
  );
};
