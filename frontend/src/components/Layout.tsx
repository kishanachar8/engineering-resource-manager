import { Outlet } from "react-router-dom";
import Nav from "./Nav"; // Assuming Nav component is styled consistently

export default function Layout() {
  return (
    // Apply a consistent background gradient to the entire application layout
    // This ensures a smooth visual transition across pages
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation bar remains at the top */}
      <Nav />
      
      {/* Main content area, takes up remaining vertical space */}
      {/* Increased horizontal padding for consistency with other pages */}
      {/* Added a flex-grow to ensure it fills available space */}
      <main className="flex-1 p-6 sm:p-8 md:p-10">
        <Outlet /> {/* Renders the matched route component */}
      </main>
    </div>
  );
}
