import React from 'react'
import About from './About'
import Contact from './Contact'
import EstimationCar from './EstimationCar'
import Home from './Home'
import Service from './Service'
import Statistique from './Statistique'

export default function Test() {
  return (
    <div>
      <Home />
      <EstimationCar />
      <Service/>
      <Statistique/>
      <About/>
      <Contact />
      <div className="progress-wrap">
        <svg
          className="progress-circle svg-content"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
      </div>
    </div>
  )
}
