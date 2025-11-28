export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-32 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>

        {/* Featured Image Skeleton */}
        <div className="mb-8 h-96 w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-700 rounded-lg animate-pulse" />

        {/* Title Skeleton */}
        <div className="mb-4 h-12 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-700 rounded-lg animate-pulse" />

        {/* Meta Info Skeleton */}
        <div className="mb-12 space-y-3">
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"
              style={{ width: `${Math.random() * 30 + 70}%` }}
            />
          ))}
        </div>

        {/* Author Section Skeleton */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Related Articles Skeleton */}
        <div className="mt-16 pt-8">
          <div className="h-8 w-1/4 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse mb-6" />
          <div className="grid gap-6 sm:grid-cols-2">
            {[...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="h-40 w-full bg-gray-200 dark:bg-slate-800 rounded-t-lg animate-pulse" />
                {/* Card Content Skeleton */}
                <div className="p-6 space-y-3">
                  <div className="h-6 w-5/6 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-4/5 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
