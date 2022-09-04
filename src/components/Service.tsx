import React from 'react'
import { useThemeContext } from '../utils/dataContext'

export default function Service() {
  const { findElementByKey } = useThemeContext()
  return (
    <section
      className="wrapper bg-light"
      id="nav_service"
    >
      <div className="container pt-12">
        <div className="row text-center">
          <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
            <h2 className="fs-16 text-uppercase  mb-3 titleBlack">
              {findElementByKey('title_service')}
            </h2>
            <h3 className="display-4 mb-9 px-xl-11">
              {findElementByKey('sous_titre_service')}
            </h3>
          </div>
        </div>
        <div className="row gy-8 mb-17">
          <div className="col-md-6 col-lg-4">
            <div className="d-flex flex-row">
              <div>
                <img
                  src="/img/svg/car-front.svg"
                  className="icon-svg icon-svg-sm solid-duo text-grape-fuchsia me-4"
                  alt=""
                />
              </div>
              <div>
                <h3 className="fs-22 mb-1">
                  {findElementByKey('titre_location_vehicule')}
                </h3>
                <p>{findElementByKey('description_location_car')}</p>
                <a
                  className="more Hover"
                  href="https://www.facebook.com/blkwlkr"
                  target="_blank"
                >
                  {findElementByKey('learn_more_footer')}
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="d-flex flex-row">
              <div>
                <img
                  src="/img/svg/house-heart-fill.svg"
                  className="icon-svg icon-svg-sm solid-duo text-grape-fuchsia me-4"
                  alt=""
                />
              </div>
              <div>
                <h3 className="fs-22 mb-1">
                  {findElementByKey('titre_location_appartement')}
                </h3>
                <p>{findElementByKey('description_location_appartment')}</p>
                <a
                  className="more Hover"
                  href="https://www.facebook.com/blkwlkr"
                  target="_blank"
                >
                  {findElementByKey('learn_more_footer')}
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="d-flex flex-row">
              <div>
                <img
                  src="/img/svg/savings.svg"
                  className="icon-svg icon-svg-sm solid-duo text-grape-fuchsia me-4"
                  alt=""
                />
              </div>
              <div>
                <h3 className="fs-22 mb-1">
                  {findElementByKey('commission_titre')}
                </h3>
                <p>{findElementByKey('commission_description')}</p>
                <a
                  className="more Hover"
                  href="https://www.facebook.com/blkwlkr"
                  target="_blank"
                >
                  {findElementByKey('learn_more_footer')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
