import { ReactNodeViewRenderer } from '@tiptap/react';
import { Image } from '@tiptap/extension-image';
import ImageComponent from './ImageComponent';

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '300px',
        parseHTML: (element) => element.getAttribute('width'),
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: 'auto',
        parseHTML: (element) => element.getAttribute('height'),
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
