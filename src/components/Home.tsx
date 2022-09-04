import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../utils/dataContext'

export default function Home() {
  const { findElementByKey, currentLanguage } = useThemeContext()
  return (
    <section
      className="wrapper bg-gradient-dark"
      id="nav_accueil"
    >
      <div className="container d-flex flex-column flex-lg-row pt-5 pb-15 py-lg-12 py-xl-14 mx-0 align-items-center justify-space-between">
        <div
          className="col-md-8 col-12"
          style={{ marginTop: '64px' }}
        >
          <img
            src="/img/Component 6.svg"
            srcSet="/img/Component 6.svg"
            data-cue="fadeIn"
            alt=""
            style={{ width: '100%' }}
          />
        </div>
        <div
          className="text-center text-lg-start row col-12 col-lg-6 mt-4 mt-lg-4"
          data-cues="slideInDown"
          data-group="page-title"
          data-delay="600"
          style={{
            animationName: 'slideInDown',
            animationDuration: '700ms',
            animationTimingFunction: 'ease',
            animationDelay: '1200ms',
            animationDirection: 'normal',
            animationFillMode: 'both',
          }}
        >
          <h1 className="display-2 mb-4 mx-sm-n2 mx-md-0 px-lg-0">
            {findElementByKey('header_title')} &nbsp;
            <p>
              {currentLanguage === 'FR' ? (
                <span
                  className="typer text-secondary text-nowrap"
                  data-delay="100"
                  data-words="simplicité.,sécurité.,fiabilité."
                  style={{ color: 'black' }}
                >
                  fast tr
                </span>
              ) : (
                <span
                  className="typer text-secondary text-nowrap"
                  data-delay="100"
                  data-words="simplicity.,security.,fiability."
                  style={{ color: 'black' }}
                >
                  fast tr
                </span>
              )}

              <span
                className="cursor text-secondary"
                data-owner="typer"
                style={{ transition: 'all 0.1s ease 0s', opacity: '1' }}
              >
                |
              </span>
            </p>
          </h1>
          <p className="lead fs-lg mb-7 px-md-10 px-lg-0">
            {findElementByKey('header_description')}
          </p>
          <div
            className="d-flex justify-content-center justify-content-lg-start p-0"
            data-group="page-title-buttons"
          >
            <span className="btn-home">
              <a className="btn btn-dark btn-icon btn-icon-start rounded me-2 btn-home">
                <i className="uil uil-apple"></i> App Store
              </a>
            </span>
            <span className="btn-home">
              <a className="btn btn-dark btn-icon btn-icon-start rounded btn-home">
                <i className="uil uil-google-play"></i> Google Play
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
