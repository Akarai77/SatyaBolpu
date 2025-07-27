import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import AudioComponent from './AudioComponent';

export const Audio = Node.create({
    name: "audio",

    group: "block",
    selectable: true,
    draggable: true,
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null
            },
            controls: {
                default: true
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
        const { src, type, align, controls } = HTMLAttributes;

        const tailwindAlignClass =
            align === 'left' ? 'mr-auto' :
            align === 'right' ? 'ml-auto' :
            'mx-auto';

        return [
            'div',
            {
                class: `w-fit ${tailwindAlignClass}`,
            },
            [
                'audio',
                {
                    src,
                    type,
                    controls,
                    style: 'width: 100%; display: block;',
                },
            ],
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(AudioComponent);
    },
});


