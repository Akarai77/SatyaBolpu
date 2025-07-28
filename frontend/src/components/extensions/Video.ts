import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import VideoComponent from './VideoComponent';

export const Video = Node.create({
    name: "video",

    group: "block",
    selectable: true,
    draggable: true,
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: (element: HTMLElement) => element.getAttribute('src'),
                    renderHTML: (attributes: Record<string, any>) => ({
                    src: attributes.src,
                }),
            },
            type: {
                default: null,
                parseHTML: (element: HTMLElement) => element.getAttribute('type'),
                renderHTML: (attributes: Record<string, any>) => ({
                  type: attributes.type,
                }),
            },
            controls: {
                default: true,
                parseHTML: (element: HTMLElement) => element.getAttribute('controls'),
                renderHTML: (attributes: Record<string, any>) => ({
                  controls: attributes.controls,
                }),
            },
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
              caption: {
                default: '',
                parseHTML: (element: HTMLElement) => {
                  const captionElement = element.querySelector('p.caption')
                  return captionElement?.textContent ?? ''
                },
                renderHTML: (attributes: Record<string, any>) => ({
                  caption: attributes.caption,
                }),
              },
        };
    },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const { src, type, width, height, align, caption, controls } = HTMLAttributes

    const tailwindAlignClass =
      align === 'left'
        ? 'mr-auto'
        : align === 'right'
        ? 'ml-auto'
        : 'mx-auto'

    const videoChildren = [
      [
        'video',
        {
          src,
          type,
          controls,
          width,
          height,
          style: 'max-width: 100%; display: block;',
        },
      ],
    ]

    if (caption) {
      videoChildren.push([
        'p',
        {
          class: 'caption text-center text-[1rem] text-gray-300 mt-2',
        },
        caption,
      ])
    }

    return [
      'div',
      {
        class: `w-fit ${tailwindAlignClass}`,
      },
      ...videoChildren,
    ]
  },

    addNodeView() {
        return ReactNodeViewRenderer(VideoComponent);
    },
});

