import type { Message } from 'ai';

export function ImportButtons(_importChat: ((description: string, messages: Message[]) => Promise<void>) | undefined) {
  // Return empty divs instead of null to maintain component structure
  return (
    <div className="flex flex-col items-center justify-center w-auto">
      <input type="file" id="chat-import" className="hidden" accept=".json" />
      <div className="flex flex-col items-center gap-4 max-w-2xl text-center">
        {/* Buttons removed but component structure maintained */}
      </div>
    </div>
  );
}
