import { ReactNodeViewRenderer } from '@tiptap/react'
import { Image } from '@tiptap/extension-image'
import ImageComponent from './ImageComponent'

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('id'),
        renderHTML: (attributes: Record<string, any>) => ({
          id: attributes.id
        })
      },
      width: {
        default: '300px',
        parseHTML: (element: HTMLElement) =>
          element.parentElement?.getAttribute('width') ?? '300px',
        renderHTML: (attributes: Record<string, any>) => ({
          width: attributes.width,
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
    const { id, src, alt, width, align, caption } = HTMLAttributes

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
          id,
          src,
          alt,
          class: 'w-full h-full object-cover',
        },
      ],
    ]

    if (caption) {
      figureChildren.push([
        'p',
        {
          class: 'caption w-full text-center text-[1rem] text-gray-300 mt-1',
        },
        caption,
      ])
    }

    return [
      'div',
      {
        style: `width: ${width};`,
        width,
        class: `file relative max-w-full ${tailwindAlignClass}`,
      },
      ...figureChildren,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },
})

