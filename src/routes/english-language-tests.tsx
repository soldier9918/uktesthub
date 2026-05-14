import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/english-language-tests")({
  component: EnglishLayout,
});

function EnglishLayout() {
  return <Outlet />;
}
