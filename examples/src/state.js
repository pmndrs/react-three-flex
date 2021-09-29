import BH41NVu from './images/BH41NVu.jpg'
import fBoIJLX from './images/fBoIJLX.jpg'
import _04zTfWB from './images/04zTfWB.jpg'
import c4cA8UN from './images/c4cA8UN.jpg'
import ajQ73ol from './images/ajQ73ol.jpg'
import gZOmLNU from './images/gZOmLNU.jpg'
import mbFIW1b from './images/mbFIW1b.jpg'
import mlDUVig from './images/mlDUVig.jpg'
import gwuZrgo from './images/gwuZrgo.jpg'
import cAKwexj from './images/cAKwexj.jpg'

const state = {
  top: 0,
  pages: 0,
  threshold: 4,
  mouse: [0, 0],
  content: [
    {
      tag: '00',
      text: `The Bacchic\nand Dionysiac\nRites`,
      images: [BH41NVu, fBoIJLX, _04zTfWB],
    },
    { tag: '01', text: `The Elysian\nMysteries`, images: [c4cA8UN, ajQ73ol, gZOmLNU] },
    { tag: '02', text: `The Hiramic\nLegend`, images: [mbFIW1b, mlDUVig, gwuZrgo] },
  ],
  depthbox: [
    {
      depth: 0,
      color: '#cccccc',
      textColor: '#ffffff',
      text: 'In a void,\nno one could say\nwhy a thing\nonce set in motion\nshould stop anywhere.',
      image: cAKwexj,
    },
    {
      depth: -5,
      textColor: '#272727',
      text: 'For why should it stop\nhere rather than here?\nSo that a thing\nwill either be at rest\nor must be moved\nad infinitum.',
      image: _04zTfWB,
    },
  ],
  lines: [
    {
      points: [
        [-20, 0, 0],
        [-9, 0, 0],
      ],
      color: 'black',
      lineWidth: 0.5,
    },
    {
      points: [
        [20, 0, 0],
        [9, 0, 0],
      ],
      color: 'black',
      lineWidth: 0.5,
    },
  ],
}

export default state
