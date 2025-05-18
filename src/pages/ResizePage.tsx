
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Download, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  ImageDimensions, 
  formatFileSize, 
  resizeImage,
  downloadImage
} from "../utils/imageUtils";

const ResizePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State variables
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [newDimensions, setNewDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Get image from session storage
  useEffect(() => {
    const storedImageUrl = sessionStorage.getItem("imageFile");
    const storedFileName = sessionStorage.getItem("fileName");
    
    if (!storedImageUrl || !storedFileName) {
      navigate("/");
      return;
    }
    
    setImageUrl(storedImageUrl);
    setFileName(storedFileName);
    
    // Load image to get dimensions
    const img = new Image();
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
      const ratio = originalWidth / originalHeight;
      
      setOriginalDimensions({ width: originalWidth, height: originalHeight });
      setNewDimensions({ width: originalWidth, height: originalHeight });
      setAspectRatio(ratio);
    };
    img.src = storedImageUrl;
  }, [navigate]);

  // Handle width change
  const handleWidthChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    
    if (lockAspectRatio) {
      const newHeight = Math.round(newWidth / aspectRatio);
      setNewDimensions({ width: newWidth, height: newHeight });
    } else {
      setNewDimensions({ ...newDimensions, width: newWidth });
    }
  }, [lockAspectRatio, aspectRatio, newDimensions]);

  // Handle height change
  const handleHeightChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    
    if (lockAspectRatio) {
      const newWidth = Math.round(newHeight * aspectRatio);
      setNewDimensions({ width: newWidth, height: newHeight });
    } else {
      setNewDimensions({ ...newDimensions, height: newHeight });
    }
  }, [lockAspectRatio, aspectRatio, newDimensions]);

  // Process image when dimensions change
  useEffect(() => {
    const debouncedResize = setTimeout(() => {
      if (
        imageUrl && 
        newDimensions.width > 0 && 
        newDimensions.height > 0 &&
        (newDimensions.width !== originalDimensions.width || 
         newDimensions.height !== originalDimensions.height)
      ) {
        setIsProcessing(true);
        
        resizeImage(imageUrl, newDimensions.width, newDimensions.height)
          .then(blob => {
            if (resizedImageUrl) {
              URL.revokeObjectURL(resizedImageUrl);
            }
            const url = URL.createObjectURL(blob);
            setResizedImageUrl(url);
            setIsProcessing(false);
          })
          .catch(error => {
            console.error("Error resizing image:", error);
            toast({
              title: "Error",
              description: "Failed to resize image",
              variant: "destructive",
            });
            setIsProcessing(false);
          });
      }
    }, 500);
    
    return () => clearTimeout(debouncedResize);
  }, [imageUrl, newDimensions, originalDimensions, toast, resizedImageUrl]);

  // Handle aspect ratio lock toggle
  const handleLockAspectRatioChange = useCallback((checked: boolean) => {
    setLockAspectRatio(checked);
    
    if (checked) {
      // When re-enabling lock, adjust height based on current width
      const newHeight = Math.round(newDimensions.width / aspectRatio);
      setNewDimensions({ ...newDimensions, height: newHeight });
    }
  }, [newDimensions, aspectRatio]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!resizedImageUrl) {
      toast({
        title: "Error",
        description: "No resized image available for download",
        variant: "destructive",
      });
      return;
    }
    
    fetch(resizedImageUrl)
      .then(response => response.blob())
      .then(blob => {
        const fileNameParts = fileName.split('.');
        const extension = fileNameParts.pop() || 'png';
        const baseName = fileNameParts.join('.');
        const newFileName = `${baseName}-${newDimensions.width}x${newDimensions.height}.${extension}`;
        
        downloadImage(blob, newFileName);
        
        toast({
          title: "Success",
          description: "Voilà! Your image has been saved.",
        });
      })
      .catch(error => {
        console.error("Error downloading image:", error);
        toast({
          title: "Error",
          description: "Failed to download image",
          variant: "destructive",
        });
      });
  }, [resizedImageUrl, fileName, newDimensions, toast]);

  // Handle back navigation
  const handleBack = () => {
    // Clean up URLs
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (resizedImageUrl) URL.revokeObjectURL(resizedImageUrl);
    
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="mr-2 hover:bg-secondary/10 focus-visible:bg-secondary/10"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-heading font-bold gradient-text">Resize Image</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <div className="bg-card rounded-[1.5rem] shadow-md p-6 mb-6 hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Original Image</h2>
            
            {imageUrl ? (
              <div className="flex flex-col">
                <div className="relative bg-muted rounded-lg overflow-hidden mb-4">
                  <img 
                    src={imageUrl} 
                    alt="Original" 
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Dimensions: {originalDimensions.width} × {originalDimensions.height}px</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                <Image className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="bg-card rounded-[1.5rem] shadow-md p-6 hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Resize Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="lockAspect" className="text-base cursor-pointer">
                  Lock aspect ratio
                </Label>
                <Switch
                  id="lockAspect"
                  checked={lockAspectRatio}
                  onCheckedChange={handleLockAspectRatioChange}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={newDimensions.width}
                    onChange={handleWidthChange}
                    className="text-base focus-visible:ring-primary"
                    aria-label="Width in pixels"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={newDimensions.height}
                    onChange={handleHeightChange}
                    className="text-base focus-visible:ring-primary"
                    aria-label="Height in pixels"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-[1.5rem] shadow-md p-6 hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Resized Preview</h2>
          
          <div className="relative bg-muted rounded-lg overflow-hidden mb-6" style={{ minHeight: "300px" }}>
            {isProcessing ? (
              <div className="flex items-center justify-center h-full">
                <div className="spinner"></div>
              </div>
            ) : resizedImageUrl ? (
              <img 
                src={resizedImageUrl} 
                alt="Resized" 
                className="w-full h-auto object-contain"
              />
            ) : imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Original" 
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <Image className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {resizedImageUrl && (
            <div className="text-center">
              <p className="text-lg font-medium mb-6 gradient-text">
                Voilà, your image is ready!
              </p>
              <Button 
                onClick={handleDownload} 
                className="w-full group relative overflow-hidden"
                size="lg"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-white/20 group-hover:translate-x-0 group-hover:opacity-0"></span>
                <Download className="mr-2 h-5 w-5" />
                Download Resized Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResizePage;
