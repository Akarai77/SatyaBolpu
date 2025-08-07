import { useRef } from 'react';
import BaseComponent from './BaseComponent';

const ImageComponent = (props) => {
  const { node } = props;
  const imgRef = useRef<HTMLImageElement | null>(null);

  const imageEl = (
    <img
      id={node.attrs.id}
      src={node.attrs.src}
      ref={imgRef}
      alt="image"
      width={node.attrs.width}
      className="w-full h-full object-cover"
    />
  );

  return <BaseComponent {...props} enableAlign enableResize enableCaption mediaRef={imgRef} mediaElement={imageEl} />;
};

export default ImageComponent;

