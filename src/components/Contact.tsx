import React from 'react'
import { useThemeContext } from '../utils/dataContext'

export default function Contact() {
  const { findElementByKey } = useThemeContext()

  return (
    <section
      className="wrapper bg-light"
      id="nav_contact"
    >
      <div className="container">
        <div
          className="row gx-3 gy-md-16 gy-8 mb-15 mb-md-18 align-items-center"
          id="contact"
        >
          <div className="col-lg-6">
            <figure>
              <img
                className="img-fluid"
                src="/img/3d3.png"
                srcSet="/img/3d3@2x.png 2x"
                alt=""
              />
            </figure>
          </div>
          <div
            className="col-lg-5 "
            style={{ marginLeft: '3%' }}
          >
            <h2 className="fs-16 text-uppercase text-dark mb-3 titleBlack">
              {findElementByKey('contact_titre')}
            </h2>
            <h3 className="display-4 mb-8">
              {findElementByKey('contact_description')}
            </h3>
            <div>
              <div className="d-flex flex-row">
                <div>
                  <img
                    src="/img/svg/pin.svg"
                    className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4"
                    style={{ width: '1.5rem', height: '1.5rem' }}
                    alt=""
                  />
                </div>
                <div>
                  <h5 className="mb-0">
                    {findElementByKey('contact_addresse')}
                  </h5>
                  <address>{findElementByKey('addresse_value')}</address>
                </div>
              </div>
              <div className="d-flex flex-row">
                <div>
                  <img
                    src="/img/svg/rotary.svg"
                    className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4"
                    style={{ width: '1.5rem', height: '1.5rem' }}
                    alt=""
                  />
                </div>
                <div>
                  <h5 className="mb-0">
                    {findElementByKey('contact_telephone')}
                  </h5>
                  <address>{findElementByKey('telephone_value')}</address>
                </div>
              </div>
              <div className="d-flex flex-row">
                <div>
                  <img
                    src="/img/svg/emails.svg"
                    className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4"
                    style={{ width: '1.5rem', height: '1.5rem' }}
                    alt=""
                  />
                </div>
                <div>
                  <h5 className="mb-0">{findElementByKey('contact_email')}</h5>
                  <address>
                    {' '}
                    <a
                      href="mailto:bill@blackwalker.com"
                      className="link-body"
                    >
                      {findElementByKey('email_value')}
                    </a>
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
