
import EnhancedDropZone from "../components/EnhancedDropZone";
import { CheckCircle, ArrowDown, Sparkles } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto space-y-16">
      <div className="text-center mb-4">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 gradient-text animate-fade-in">
            InstantImg
          </h1>
          <div className="absolute -top-6 -right-8 text-primary/80 animate-float" style={{animationDelay: "1s"}}>
            <Sparkles className="w-6 h-6" strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light animate-fade-in" style={{animationDelay: "0.3s"}}>
          Instantly resize and compress your images right in your browser.
          <span className="block mt-1 font-medium text-foreground/90">No uploads to servers, everything stays on your device.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
        <EnhancedDropZone
          title="Resize Image"
          description="Drag and drop your image here, or upload"
          toolPath="/resize"
          gradientClass="bg-gradient-to-br from-[#8B5CF6] to-[#D946EF]"
        />
        <EnhancedDropZone
          title="Reduce Image Size"
          description="Drag and drop your image here, or upload"
          toolPath="/compress"
          gradientClass="bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6]"
        />
      </div>
      
      <div className="relative w-full">
        <ArrowDown className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-primary/70 animate-bounce w-8 h-8" />
        
        <div className="relative bg-gradient-to-b from-transparent via-muted/50 to-transparent py-16 rounded-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/80 to-transparent rounded-[3rem] backdrop-blur-sm"></div>
          
          <div className="relative text-center z-10">
            <h2 className="text-3xl font-heading font-bold mb-10 gradient-text inline-block relative">
              How It Works
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"></div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-card rounded-xl shadow-md group-hover:shadow-lg transition-all duration-500 group-hover:-translate-y-1"></div>
                <div className="relative p-8 bg-gradient-to-br from-card to-background rounded-xl border border-muted">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="mb-2 text-xl font-semibold">1. Drop or Upload</div>
                  <p className="text-muted-foreground">
                    Simply drag & drop or select an image to get started instantly
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-card rounded-xl shadow-md group-hover:shadow-lg transition-all duration-500 group-hover:-translate-y-1"></div>
                <div className="relative p-8 bg-gradient-to-br from-card to-background rounded-xl border border-muted">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="mb-2 text-xl font-semibold">2. Adjust Settings</div>
                  <p className="text-muted-foreground">
                    Customize size or compression level with real-time preview
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-card rounded-xl shadow-md group-hover:shadow-lg transition-all duration-500 group-hover:-translate-y-1"></div>
                <div className="relative p-8 bg-gradient-to-br from-card to-background rounded-xl border border-muted">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="mb-2 text-xl font-semibold">3. Download</div>
                  <p className="text-muted-foreground">
                    Save your optimized image directly to your device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/60 p-8 rounded-3xl text-center max-w-2xl mx-auto hover:bg-muted/80 transition-all duration-500 backdrop-blur-sm border border-muted shadow-sm">
        <div className="flex items-center justify-center mb-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">
            100% Privacy First
          </h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          All processing happens directly in your browser. Your images never leave your device or get uploaded to any server.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
