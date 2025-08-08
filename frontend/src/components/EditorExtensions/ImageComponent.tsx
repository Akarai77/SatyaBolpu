import { useRef } from 'react';
import BaseComponent from './BaseComponent';

const ImageComponent = (props) => {
  const { node } = props;
  const imgRef = useRef<HTMLImageElement | null>(null);

  const imageEl = (
    <img
      data-idbkey={node.attrs.idbKey}
      src={node.attrs.src}
      ref={imgRef}
      alt="image"
      className="w-full h-full object-cover"
    />
  );

  return <BaseComponent {...props} enableAlign enableResize enableCaption mediaRef={imgRef} mediaElement={imageEl} />;
};

export default ImageComponent;

