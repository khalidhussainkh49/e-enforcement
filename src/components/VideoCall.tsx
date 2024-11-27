import { useState, useEffect, useRef } from 'react';
import { Video, PhoneOff, Maximize2 } from 'lucide-react';
import VideoService from '../services/videoService';

interface VideoCallProps {
  selectedUserId?: string;
}

export default function VideoCall({ selectedUserId }: VideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoService = VideoService.getInstance();

  const startCall = async () => {
    if (selectedUserId) {
      await videoService.startCall(selectedUserId);
      setIsCallActive(true);
    }
  };

  const endCall = () => {
    videoService.endCall();
    setIsCallActive(false);
  };

  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await videoContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (isCallActive) {
        endCall();
      }
    };
  }, [isCallActive]);

  return (
    <div 
      ref={videoContainerRef}
      className={`bg-white rounded-lg shadow-md p-4 ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">Video Call</h3>
        </div>
        <div className="flex gap-2">
          {selectedUserId && (
            <button
              onClick={isCallActive ? endCall : startCall}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isCallActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isCallActive ? (
                <>
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Start Call</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        <div className={`relative aspect-video bg-gray-100 rounded-lg overflow-hidden ${
          isFullscreen ? 'absolute inset-4' : ''
        }`}>
          <video
            id="localVideo"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 left-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            You
          </span>
        </div>
        {!isFullscreen && (
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              id="remoteVideo"
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              Remote
            </span>
          </div>
        )}
      </div>
    </div>
  );
}