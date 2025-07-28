import { useRef } from 'react';
import BaseComponent from './BaseComponent';

const ImageComponent = (props) => {
  const { node } = props;
  const imgRef = useRef<HTMLImageElement | null>(null);

  const imageEl = (
    <img
      src={node.attrs.src}
      ref={imgRef}
      alt="image"
      className="w-full h-full"
    />
  );

  return <BaseComponent {...props} enableAlign enableResize enableCaption mediaRef={imgRef} mediaElement={imageEl} />;
};

export default ImageComponent;

