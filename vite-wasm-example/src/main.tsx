import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Canvas } from '@react-three/fiber'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Canvas>
      <App />
    </Canvas>
  </React.StrictMode>,
  document.getElementById('root')
)
