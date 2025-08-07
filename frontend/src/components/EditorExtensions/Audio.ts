import { Node, mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import AudioComponent from './AudioComponent';
import { element } from 'prop-types';

export const Audio = Node.create({
  name: 'audio',

  group: 'block',
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
        controls : {
            default: true,
            parseHtml: (element: HTMLElement) => element.getAttribute('controls'),
            renderHTML: (attributes: Record<string, any>) => ({
                controls: attributes.controls
            })
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
        tag: 'audio[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { id, src, type, width, caption, controls } = HTMLAttributes

    const audioChildren = [
      [
        'audio',
        {
          id,
          src,
          type,
          controls,
          class: 'w-full',
        },
      ],
    ]

    if (caption) {
      audioChildren.push([
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
        class: `file relative max-w-full mx-auto`,
        style: `width: ${width}`
      },
      ...audioChildren,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioComponent);
  },
});

