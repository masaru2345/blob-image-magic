
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: "0s" }}></div>
        <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: "2s" }}></div>
        {!isMobile && (
          <div className="absolute top-[20%] left-[15%] w-[30vw] h-[30vw] bg-gradient-to-br from-accent/20 to-primary/20 rounded-full filter blur-3xl opacity-40 animate-blob" style={{ animationDelay: "4s" }}></div>
        )}
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
