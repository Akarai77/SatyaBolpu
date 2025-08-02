import { Extension } from '@tiptap/core';

export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
      fontSizes: ['small','normal','large','huge'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize === 'small' ? '1rem' : 
                                            attributes.fontSize === 'normal' ? '1.5rem' :
                                            attributes.fontSize === 'large' ? '2rem' :
                                            attributes.fontSize === 'huge' ? '2.5rem' : ''}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize) => ({ commands }) => {
        if (!this.options.fontSizes.includes(fontSize)) {
          return false;
        }
        return commands.setMark('textStyle', { fontSize });
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.removeMark('textStyle', { fontSize: null });
      },
    };
  },
});
