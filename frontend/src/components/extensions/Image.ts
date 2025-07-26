import { ReactNodeViewRenderer } from '@tiptap/react';
import { Image } from '@tiptap/extension-image';
import ImageComponent from './ImageComponent';

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '300px',
        parseHTML: (element: HTMLElement) => element.getAttribute('width') || '300px',
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: 'auto',
        parseHTML: (element) => element.getAttribute('height') || 'auto',
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('align') || 'center',
        renderHTML: (attributes) => ({
          'align': attributes.align,
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, width, height, align } = HTMLAttributes;

    const tailwindAlignClass =
      align === 'left' ? 'mr-auto' :
      align === 'right' ? 'ml-auto' :
      'mx-auto';

    return [
      'div',
      {
        class: `custom-image-wrapper w-fit ${tailwindAlignClass}`,
        'data-align': align,
      },
      [
        'img',
        {
          src,
          alt,
          width,
          height,
          style: 'max-width: 100%; display: block;',
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
