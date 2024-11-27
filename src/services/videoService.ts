import Peer from 'peerjs';

class VideoService {
  private static instance: VideoService;
  private peer: Peer;
  private currentCall: any;

  private constructor() {
    this.peer = new Peer();
    this.setupPeerEvents();
  }

  public static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  private setupPeerEvents() {
    this.peer.on('open', (id) => {
      console.log('My peer ID is:', id);
    });

    this.peer.on('call', (call) => {
      const userResponse = window.confirm('Incoming video call. Accept?');
      if (userResponse) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            call.answer(stream);
            this.setupCallEvents(call);
          })
          .catch(err => {
            console.error('Failed to get local stream', err);
          });
      }
    });
  }

  private setupCallEvents(call: any) {
    call.on('stream', (remoteStream: MediaStream) => {
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
      }
    });

    call.on('close', () => {
      this.endCall();
    });

    this.currentCall = call;
  }

  public async startCall(remotePeerId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const call = this.peer.call(remotePeerId, stream);
      this.setupCallEvents(call);
      
      const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
      if (localVideo) {
        localVideo.srcObject = stream;
      }
    } catch (err) {
      console.error('Failed to get local stream', err);
    }
  }

  public endCall() {
    if (this.currentCall) {
      this.currentCall.close();
      this.currentCall = null;
    }
    
    const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    
    if (localVideo) {
      const stream = localVideo.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      localVideo.srcObject = null;
    }
    
    if (remoteVideo) {
      remoteVideo.srcObject = null;
    }
  }

  public getPeerId(): string {
    return this.peer.id;
  }
}

export default VideoService;