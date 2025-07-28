import { useRef } from 'react';
import BaseComponent from './BaseComponent';

const VideoComponent = (props) => {
  const { node } = props;
  const vidRef = useRef<HTMLVideoElement | null>(null);

  const videoEl = (
    <video
      controls
      ref={vidRef}
      className="w-full h-full"
    >
        <source src={node.attrs.src} type={node.attrs.type}/>
    </video>
  );

  return <BaseComponent {...props} enableAlign enableResize enableCaption mediaRef={vidRef} mediaElement={videoEl} />;
};

export default VideoComponent;
