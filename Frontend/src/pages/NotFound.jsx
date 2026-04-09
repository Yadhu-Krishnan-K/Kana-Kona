import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Decorative Background Blobs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-md w-full text-center z-10">
        {/* Animated Ghost Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative animate-bounce">
            <Ghost size={120} className="text-primary opacity-80" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/10 rounded-[100%] blur-md"></div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-black text-base-content/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
          404
        </h1>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-base-content">
            Lost in Space?
          </h2>
          <p className="text-base-content/70 text-lg">
            The page you're looking for has vanished into the digital void. 
            Even our ghost couldn't find it.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-outline btn-primary gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            
            <Link to="/" className="btn btn-primary gap-2 shadow-lg shadow-primary/30">
              <Home size={18} />
              Take Me Home
            </Link>
          </div>
        </div>

        {/* DaisyUI Stats - Just for visual "flair" */}
        <div className="mt-12 grid grid-cols-3 gap-2 opacity-50">
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold">Status</span>
            <span className="text-sm">Missing</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold">Location</span>
            <span className="text-sm">Unknown</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold">Likelihood</span>
            <span className="text-sm">0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;