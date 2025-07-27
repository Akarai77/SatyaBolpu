import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export default function IframeComponent({ node }: any) {
  const html = node.attrs.html

  return (
      <NodeViewWrapper>
        <div
          className='w-fit mx-auto'
          data-iframe-embed
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </NodeViewWrapper>
  )
}

