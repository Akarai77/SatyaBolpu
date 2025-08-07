import { useRef } from 'react';
import BaseComponent from './BaseComponent';

const VideoComponent = (props) => {
  const { node } = props;
  const IFrameRef = useRef<HTMLDivElement | null>(null);

  const IFrameEl = (
      <div
          className='w-fit mx-auto'
          data-iframe-embed
          ref={IFrameRef}
          dangerouslySetInnerHTML={{ __html: node.attrs.html }}
      />
  );

  return <BaseComponent {...props} enableCaption mediaRef={IFrameRef} mediaElement={IFrameEl} />;
};

export default VideoComponent;

