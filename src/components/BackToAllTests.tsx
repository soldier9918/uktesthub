import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackToAllTests() {
  return (
    <div className="border-b border-border bg-[#f7f5f0]">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-5">
        <Link
          to="/all-tests"
          className="inline-flex items-center gap-2.5 rounded-none border-2 border-coral/30 bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-elevated transition-all hover:-translate-y-0.5 hover:border-coral hover:text-coral md:px-6 md:py-3 md:text-base"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to all tests
        </Link>
      </div>
    </div>
  );
}
