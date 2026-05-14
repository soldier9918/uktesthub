import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/english-language-tests/$test/$skill/$level",
)({
  component: () => <Outlet />,
});
