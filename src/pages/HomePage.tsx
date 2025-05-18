
import EnhancedDropZone from "../components/EnhancedDropZone";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 gradient-text">
          InstantImg
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Instantly resize and compress your images right in your browser.
          No uploads to servers, everything stays on your device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
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
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-2 text-lg font-semibold">1. Drop or Upload</div>
            <p className="text-muted-foreground">
              Simply drag & drop or select an image to get started instantly
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-2 text-lg font-semibold">2. Adjust Settings</div>
            <p className="text-muted-foreground">
              Customize size or compression level with real-time preview
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-2 text-lg font-semibold">3. Download</div>
            <p className="text-muted-foreground">
              Save your optimized image directly to your device
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-muted p-6 rounded-xl text-center max-w-2xl mx-auto hover:bg-muted/80 transition-colors">
        <h2 className="text-xl font-semibold mb-2">
          100% Privacy First
        </h2>
        <p className="text-muted-foreground">
          All processing happens directly in your browser. Your images never leave your device or get uploaded to any server.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
