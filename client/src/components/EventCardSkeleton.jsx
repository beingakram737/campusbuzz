const EventCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl bg-glass p-4 border border-white/10">
      <div className="mb-3 h-40 rounded-xl bg-white/10" />
      <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
      <div className="h-3 w-1/2 rounded bg-white/10" />
    </div>
  );
};

export default EventCardSkeleton;
