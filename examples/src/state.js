const imgur = (id) => `https://i.imgur.com/${id}.jpg`

const state = {
  top: 0,
  pages: 0,
  threshold: 4,
  content: [
    { tag: '00', text: `The Bacchic\nand Dionysiac\nRites`, image1: imgur('20xjASS'), image2: imgur('M2mxjL5') },
    { tag: '01', text: `The Elysian\nMysteries`, image1: imgur('GfFfjb6'), image2: imgur('RzKRbxn') },
    { tag: '02', text: `The Hiramic\nLegend`, image1: imgur('YWrVODD'), image2: imgur('DPDfTB9') },
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
