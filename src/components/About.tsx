import React from 'react'
import { useThemeContext } from '../utils/dataContext'

export default function About() {
  const { findElementByKey } = useThemeContext()
  return (
    <section
      className="wrapper bg-light"
      id="nav_a_propos"
    >
      <div className="container py-2 py-md-16">
        <div className="row gy-10 gy-sm-13 gx-md-8 gx-xl-12 align-items-center">
          <div className="col-lg-6">
            <div className="row gx-md-5 gy-5">
              <div className="col-12">
                <figure className="rounded mx-5">
                  <img
                    src="/img/svg/about-us.svg"
                    srcSet="/img/photos/g8@2x.jpg 2x"
                    alt=""
                  />
                </figure>
              </div>
              <div className="col-md-6">
                <figure className="rounded">
                  <img
                    src="/img/svg/Good team-pana.svg"
                    srcSet="/img/photos/g9@2x.jpg 2x"
                    alt=""
                  />
                </figure>
              </div>
              <div className="col-md-6">
                <figure className="rounded">
                  <img
                    src="/img/svg/Back to back-pana.svg"
                    srcSet="/img/photos/g10@2x.jpg 2x"
                    alt=""
                  />
                </figure>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h2 className="fs-16 text-uppercase text-center text-dark mb-3">
              {findElementByKey('title_about')}
            </h2>
            <h3 className="display-3 mb-10 text-center">
              {findElementByKey('description_about1')}
              <span className="fade-in">
                {findElementByKey('description_about2')}{' '}
              </span>
              {findElementByKey('description_about')}
            </h3>
            <div className="row gy-8">
              <div className="col-md-6">
                <div className="d-flex flex-row">
                  <div>
                    <img
                      src="/img/svg/geo-fill.svg"
                      className="icon-svg icon-svg-xs solid-mono text-fuchsia me-4"
                      alt=""
                    />
                  </div>
                  <div>
                    <h4 className="mb-1">
                      {' '}
                      {findElementByKey('title_about1')}
                    </h4>
                    <p>{findElementByKey('description_titre1')}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-row">
                  <div>
                    <img
                      src="/img/svg/person-hearts.svg"
                      className="icon-svg icon-svg-xs solid-mono text-violet me-4"
                      alt=""
                    />
                  </div>
                  <div>
                    <h4 className="mb-1">
                      {findElementByKey('title_about2')}
                    </h4>
                    <p>{findElementByKey('description_titre2')}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-row">
                  <div>
                    <img
                      src="/img/svg/shield-fill-check.svg"
                      className="icon-svg icon-svg-xs solid-mono text-orange me-4"
                      alt=""
                    />
                  </div>
                  <div>
                    <h4 className="mb-1">
                      {findElementByKey('title_about3')}
                    </h4>
                    <p>{findElementByKey('description_titre3')}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-row">
                  <div>
                    <img
                      src="/img/svg/crown-23.svg"
                      className="icon-svg icon-svg-xs solid-mono text-green me-4"
                      alt=""
                    />
                  </div>
                  <div>
                    <h4 className="mb-1">{findElementByKey('title_about4')}</h4>
                    <p>{findElementByKey('description_titre4')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
