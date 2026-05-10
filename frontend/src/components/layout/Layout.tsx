import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--bg-secondary)" }}
    >
      <Navbar />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
