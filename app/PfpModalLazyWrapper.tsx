import React, { Suspense } from "react";

const LazyPfpModal = React.lazy(() => import("./PfpModalLazy"));

export function PfpModalLazyWrapper(props: { onClose: () => void }) {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[120] flex items-center justify-center p-4"><div className="bg-black/60 rounded-xl p-8 text-white text-lg">Loading gallery...</div></div>}>
      <LazyPfpModal {...props} />
    </Suspense>
  );
}
