// components/Layout.tsx
import { Outlet } from "react-router-dom"
import Nav from "./Nav"

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
