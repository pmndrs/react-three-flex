const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`

const state = {
  top: 0,
  pages: 0,
  threshold: 4,
  content: [
    { tag: '00', text: `The Bacchic\nand Dionysiac\nRites`, image1: pexels(911738), image2: pexels(358574) },
    { tag: '01', text: `The Elysian\nMysteries`, image1: pexels(416430), image2: pexels(1738986) },
    { tag: '02', text: `The Hiramic\nLegend`, image1: pexels(1005644), image2: pexels(327482) },
  ],
  depthimg:
    'https://images.unsplash.com/photo-1500412830877-c77d92c33203?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=gian-d-YE6iUShVcps-unsplash.jpg&w=1920',
  depthbox: [
    {
      depth: 0,
      color: '#cccccc',
      textColor: 'white',
      text: 'In a void,\nno one could say\nwhy a thing\nonce set in motion\nshould stop anywhere',
    },
    {
      depth: -6,
      textColor: 'white',
      text:
        'For why should it stop\nhere rather than here?\nSo that a thing\nwill either be at rest\nor must be moved\nad infinitum',
    },
  ],
}

export default state
