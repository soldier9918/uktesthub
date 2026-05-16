import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackToAllTests() {
  return (
    <div className="border-b border-border bg-[#f7f5f0]">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <Link
          to="/all-tests"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft transition-colors hover:border-coral/40 hover:text-coral"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all tests
        </Link>
      </div>
    </div>
  );
}
