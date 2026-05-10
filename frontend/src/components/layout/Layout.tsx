import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px" }}>
        <Outlet />
      </main>
    </div>
  );
}
