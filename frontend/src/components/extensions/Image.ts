import { ReactNodeViewRenderer } from '@tiptap/react'
import { Image } from '@tiptap/extension-image'
import ImageComponent from './ImageComponent'

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '300px',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('width') ?? '300px',
        renderHTML: (attributes: Record<string, any>) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: 'auto',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('height') ?? 'auto',
        renderHTML: (attributes: Record<string, any>) => ({
          height: attributes.height,
        }),
      },
      align: {
        default: 'center',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('align') ?? 'center',
        renderHTML: (attributes: Record<string, any>) => ({
          align: attributes.align,
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
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const { src, alt, width, height, align, caption } = HTMLAttributes

    const tailwindAlignClass =
      align === 'left'
        ? 'mr-auto'
        : align === 'right'
        ? 'ml-auto'
        : 'mx-auto'

    const figureChildren = [
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
    ]

    if (caption) {
      figureChildren.push([
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
      ...figureChildren,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },
})

