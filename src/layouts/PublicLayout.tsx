import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <main className="flex flex-1 justify-center min-h-screen">
        <Outlet />
    </main>
  );
}
