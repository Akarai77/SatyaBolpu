import Quill from 'quill';

export const Size = Quill.import('formats/size');
Size.whitelist = ['normal', 'small', 'large', 'huge'];
Quill.register(Size, true);
