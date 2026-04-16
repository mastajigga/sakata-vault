"use client";

import dynamic from "next/dynamic";

const GeographieClient = dynamic(
  () => import("./GeographieClient"),
  { ssr: false, loading: () => <GeographieLoadingScreen /> }
);

function GeographieLoadingScreen() {
  return (
    <div className="relative h-screen w-screen bg-[#050B08] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full border-2 border-[#E9C46A] border-t-transparent animate-spin mx-auto" />
        </div>
        <p className="text-[#E9DCC9]/60 font-light tracking-widest">
          Invocation du territoire...
        </p>
      </div>
    </div>
  );
}

export default function GeographiePageClient() {
  return <GeographieClient />;
}
