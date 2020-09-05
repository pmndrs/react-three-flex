const imgur = (id) => `https://i.imgur.com/${id}.jpg`

const state = {
  top: 0,
  pages: 0,
  threshold: 4,
  content: [
    {
      tag: '00',
      text: `The Bacchic\nand Dionysiac\nRites`,
      images: [imgur('20xjASS'), imgur('M2mxjL5'), imgur('M2mxjL5')],
    },
    { tag: '01', text: `The Elysian\nMysteries`, images: [imgur('GfFfjb6'), imgur('RzKRbxn'), imgur('RzKRbxn')] },
    { tag: '02', text: `The Hiramic\nLegend`, images: [imgur('YWrVODD'), imgur('DPDfTB9'), imgur('DPDfTB9')] },
  ],
  depthimg: imgur('jBx6WrQ'),
  depthbox: [
    {
      depth: 0,
      color: '#cccccc',
      textColor: '#ffffff',
      text: 'In a void,\nno one could say\nwhy a thing\nonce set in motion\nshould stop anywhere',
    },
    {
      depth: -6,
      textColor: '#0a0a0a',
      text:
        'For why should it stop\nhere rather than here?\nSo that a thing\nwill either be at rest\nor must be moved\nad infinitum',
    },
  ],
}

export default state
