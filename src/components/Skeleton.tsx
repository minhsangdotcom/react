const SkeletonInput = () => (
  <div className="space-y-2">
    <div className="h-4 w-28 rounded bg-gray-200" />
    <div className="h-12 rounded bg-gray-200" />
  </div>
);
const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`rounded bg-gray-200 ${className}`} />
);
const SkeletonWideInput = () => (
  <div className="space-y-2">
    <SkeletonBlock className="h-4 w-32" />
    <SkeletonBlock className="h-12 w-full" />
  </div>
);

const SkeletonSelect = () => (
  <div className="space-y-2">
    <div className="h-4 w-32 rounded bg-gray-200" />
    <div className="h-12 rounded bg-gray-200" />
  </div>
);

const SkeletonToggle = () => (
  <div className="space-y-2">
    <SkeletonBlock className="h-4 w-28" />
    <SkeletonBlock className="h-6 w-14 rounded-full mt-3" />
  </div>
);

const DividerSkeleton = () => <div className="h-px bg-gray-200 w-full" />;

export { DividerSkeleton, SkeletonInput, SkeletonSelect, SkeletonBlock,SkeletonToggle, SkeletonWideInput };
