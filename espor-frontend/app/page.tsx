import { Suspense } from "react";
import LiveDashboard from "@/components/LiveDashboard";

export default function Home() {
  return (
    <div className="w-full h-full overflow-hidden">
      <Suspense fallback={null}>
        <LiveDashboard />
      </Suspense>
    </div>
  );
}
