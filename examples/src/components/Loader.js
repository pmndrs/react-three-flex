import React from 'react'
import { useProgress } from 'drei'
import { a, useTransition } from '@react-spring/web'

export default function Loader() {
  const { active, progress } = useProgress()
  const transition = useTransition(active, {
    from: { opacity: 1, progress: 0 },
    leave: { opacity: 0 },
    update: { progress },
  })
  return transition(
    ({ progress, opacity }, active) =>
      active && (
        <a.div className="loading" style={{ opacity }}>
          <div className="loading-bar-container">
            <a.div className="loading-bar" style={{ width: progress }}>
              <a.span className="loading-data">{progress.to((p) => `${p.toFixed(2)}%`)}</a.span>
            </a.div>
          </div>
        </a.div>
      )
  )
}
