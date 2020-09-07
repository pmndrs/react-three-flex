const imgur = (id) => `https://i.imgur.com/${id}.jpg`

const state = {
  top: 0,
  pages: 0,
  threshold: 4,
  mouse: [0, 0],
  content: [
    {
      tag: '00',
      text: `The Bacchic\nand Dionysiac\nRites`,
      images: [imgur('BH41NVu'), imgur('fBoIJLX'), imgur('04zTfWB')],
    },
    { tag: '01', text: `The Elysian\nMysteries`, images: [imgur('c4cA8UN'), imgur('ajQ73ol'), imgur('gZOmLNU')] },
    { tag: '02', text: `The Hiramic\nLegend`, images: [imgur('mbFIW1b'), imgur('mlDUVig'), imgur('gwuZrgo')] },
  ],
  depthbox: [
    {
      depth: 0,
      color: '#cccccc',
      textColor: '#ffffff',
      text: 'In a void,\nno one could say\nwhy a thing\nonce set in motion\nshould stop anywhere.',
      image: imgur('cAKwexj'),
    },
    {
      depth: -5,
      textColor: '#272727',
      text: 'For why should it stop\nhere rather than here?\nSo that a thing\nwill either be at rest\nor must be moved\nad infinitum.',
      image: imgur('04zTfWB'),
    },
  ],
  lines: [
    { points: [[-20, 0, 0], [-9, 0, 0]], color: "black", lineWidth: 0.5 },
    { points: [[20, 0, 0], [9, 0, 0]], color: "black", lineWidth: 0.5 },
  ]
}

export default state
