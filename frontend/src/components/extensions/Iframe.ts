import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import IframeComponent from './IframeComponent'

export const Iframe = Node.create({
  name: 'iframeEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      html: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-iframe-embed]',
        getAttrs: dom => ({
          html: dom.innerHTML,
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-iframe-embed': 'true',
        contenteditable: 'false',
      },
      HTMLAttributes.html
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(IframeComponent)
  },
})

