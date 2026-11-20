function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`rounded-xl shimmer-bg ${className}`}
      style={{ background: "rgba(255,255,255,0.08)", backgroundSize: "200% 100%" }}
    />
  );
}

export function CurrentWeatherSkeleton() {
  return (
    <div className="glass p-6 animate-pulse">
      <SkeletonBlock className="h-5 w-32 mb-4" />
      <SkeletonBlock className="h-24 w-48 mb-4" />
      <SkeletonBlock className="h-6 w-40 mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonBlock key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function HourlyForecastSkeleton() {
  return (
    <div className="glass p-4">
      <SkeletonBlock className="h-5 w-28 mb-4" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <SkeletonBlock key={i} className="flex-shrink-0 w-16 h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function DailyForecastSkeleton() {
  return (
    <div className="glass p-4">
      <SkeletonBlock className="h-5 w-28 mb-4" />
      <div className="flex flex-col gap-3">
        {[...Array(7)].map((_, i) => (
          <SkeletonBlock key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="glass p-4">
      <SkeletonBlock className="h-5 w-28 mb-4" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <SkeletonBlock key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
