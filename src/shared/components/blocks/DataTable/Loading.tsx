export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-4">
        {/* Small circle - left */}
        <div className="h-6 w-6 animate-bounce rounded-full bg-background-brand-secondary-hover [animation-delay:-0.3s]" />

        {/* Large circle - center */}
        <div className="h-6 w-6 animate-bounce rounded-full bg-background-brand-secondary-hover [animation-delay:-0.15s]" />

        {/* Small circle - right */}
        <div className="h-6 w-6 animate-bounce rounded-full bg-background-brand-secondary-hover" />
      </div>

      <p className="text-md font-normal">Loading information</p>
    </div>
  );
}
