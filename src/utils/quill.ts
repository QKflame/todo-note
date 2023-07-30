export const quillModules = {
  // https://quilljs.com/docs/modules/syntax/
  syntax: false,
  toolbar: {
    container: [
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{color: []}, {background: []}],
      [
        {list: 'ordered'},
        {list: 'bullet'},
        {indent: '-1'},
        {indent: '+1'},
        {align: []}
      ],
      ['link', 'image'],
      ['emoji'],
      ['clean']
    ],
    handlers: {emoji: function () {}}
  },
  'emoji-toolbar': true
};

export const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'size',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'align',
  'link',
  'image',
  'code-block',
  'emoji'
];
