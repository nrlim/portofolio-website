export default function ArticlesLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-700 rounded-lg animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-12">
          {/* Title Skeleton */}
          <div className="mb-4 h-14 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-700 rounded-lg animate-pulse" />
          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Articles Grid Skeleton */}
        <div className="space-y-8">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="border-b border-gray-200 dark:border-gray-800 py-8 flex gap-6 animate-pulse"
            >
              {/* Left Content */}
              <div className="flex-1 space-y-3">
                {/* Badge Skeleton */}
                <div className="flex gap-2 flex-wrap">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-slate-800 rounded-full" />
                </div>

                {/* Title Skeleton */}
                <div className="space-y-2">
                  <div className="h-8 w-5/6 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-8 w-4/5 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                </div>

                {/* Meta Info Skeleton */}
                <div className="flex gap-4 pt-4">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                </div>
              </div>

              {/* Right Image Skeleton */}
              <div className="hidden sm:block h-28 w-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-700 rounded-lg flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
