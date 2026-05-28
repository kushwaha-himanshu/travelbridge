const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse rounded-[24px] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] ${className}`} />
)

const DashboardSkeleton = () => {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SkeletonBlock className="min-h-[360px]" />
        <SkeletonBlock className="min-h-[360px]" />
      </div>
      <SkeletonBlock className="h-[230px]" />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr_0.9fr]">
        <SkeletonBlock className="h-[470px]" />
        <SkeletonBlock className="h-[470px]" />
        <SkeletonBlock className="h-[470px]" />
      </div>
      <SkeletonBlock className="h-[170px]" />
    </div>
  )
}

export default DashboardSkeleton