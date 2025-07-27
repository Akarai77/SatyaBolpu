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
                default: null
            },
            controls: {
                default: true
            },
            autoplay: {
                defaut: false
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
        };
    },

    renderHTML({ HTMLAttributes }) {
        const { src, type, width, height, align, controls, autoplay } = HTMLAttributes;

        const tailwindAlignClass =
            align === 'left' ? 'mr-auto' :
            align === 'right' ? 'ml-auto' :
            'mx-auto';

        return [
            'div',
            {
                class: `w-fit ${tailwindAlignClass}`,
                'data-align': align,
            },
            [
                'video',
                {
                    src,
                    type,
                    width,
                    height,
                    controls,
                    autoplay,
                    style: 'max-width: 100%; display: block;',
                },
            ],
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(VideoComponent);
    },
});

