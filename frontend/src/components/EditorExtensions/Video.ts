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
            id: {
              default: null,
              parseHTML: (element: HTMLElement) => element.getAttribute('id'),
              renderHTML: (attributes: Record<string, any>) => ({
                id: attributes.id
              })
            },
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

  parseHTML() {
    return [
      {
        tag: 'video[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const { src, type, width, align, caption, controls } = HTMLAttributes

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
          class: 'w-full h-full',
        },
      ],
    ]

    if (caption) {
      videoChildren.push([
        'p',
        {
          class: 'caption text-center text-[1rem] text-gray-300 mt-1',
        },
        caption,
      ])
    }

    return [
      'div',
      {
        class: `file relative max-w-full ${tailwindAlignClass}`,
        style: `width: ${width}`
      },
      ...videoChildren,
    ]
  },

    addNodeView() {
        return ReactNodeViewRenderer(VideoComponent);
    },
});

