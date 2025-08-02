import { useRef } from 'react';
import BaseComponent from './BaseComponent';

const AudioComponent = (props) => {
  const { node } = props;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioEl = (
    <audio
      ref={audioRef}
      controls
      className="w-full"
    >
        <source src={node.attrs.src} type={node.attrs.type}/>
    </audio>
  );

  return <BaseComponent {...props} enableCaption mediaRef={audioRef} mediaElement={audioEl} customStyles='w-1/4'/>;
};

export default AudioComponent;


