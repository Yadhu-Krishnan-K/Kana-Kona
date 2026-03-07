import { X, Download } from "lucide-react";

const ImageModal = ({ isOpen, onClose, imgSrc }) => {
  if (!isOpen) return null;

  // Function to handle image download
  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent modal from closing
    const link = document.createElement("a");
    link.href = imgSrc;
    link.download = "downloaded-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-6 right-6 flex gap-4">
        <button 
          onClick={handleDownload}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          title="Download"
        >
          <Download size={24} />
        </button>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* The Image */}
      <img 
        src={imgSrc} 
        alt="Full size" 
        className="max-w-[95%] max-h-[90vh] object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-200 cursor-zoom-out"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
      />
    </div>
  );
};

export default ImageModal;