import React from 'react'
import { useThemeContext } from '../utils/dataContext'

const Footer: React.FC = () => {
  const { findElementByKey, currentLanguage, setLanguage } = useThemeContext()
  return (
    <footer className="bg-dark text-white">
      <div className="container py-13 py-md-15">
        <div className="row gy-6 gy-lg-0">
          <div className="col-md-4 col-lg-3">
            <h4 className="widget-title text-white mb-3">
              <strong className="pe-xl-15 pe-xxl-17">Logo</strong>{' '}
            </h4>
          </div>
          <div className="col-md-4 col-lg-3">
            <div className="widget">
              <h4 className="widget-title text-white  mb-3">
                {findElementByKey('contact_us_footer')}
              </h4>
              <div className="d-flex flex-row align-items-center">
                <img
                  src="/img/svg/emails1.svg"
                  className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4"
                  style={{ width: '1rem', height: '1rem' }}
                  alt=""
                />
                <a
                  href="mailto:bill@blackwalker.com"
                  className="link-body text-white"
                >
                  {findElementByKey('email_value')}
                </a>
              </div>
              <div className="d-flex flex-row align-items-center">
                <img
                  src="/img/svg/rotary1.svg"
                  className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4"
                  style={{ width: '1rem', height: '1rem' }}
                  alt=""
                />
                <a
                  className="text-white"
                  href="tel:+237 698819611"
                >
                  {findElementByKey('telephone_value')}
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-lg-2">
            <div className="widget">
              <h4 className="widget-title text-white  mb-3">
                {findElementByKey('learn_more_footer')}
              </h4>
              <ul className="list-unstyled  mb-0">
                <li>
                  <a
                    className="link scroll"
                    href="#nav_a_propos"
                  >
                    {findElementByKey('a_propos_footer')}
                  </a>
                </li>
                <li>
                  <a
                    className="link scroll"
                    href="#nav_contact"
                  >
                    {findElementByKey('contact_us_footer')}
                  </a>
                </li>
                <li>
                  <a
                    className="link scroll"
                    href="#nav_service"
                  >
                    {findElementByKey('nos_service_footer')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-12 col-lg-4">
            <div className="widget">
              <h4 className="widget-title text-white  mb-3">
                {findElementByKey('notre_bulletin_footer')}
              </h4>
              <p className="mb-5">
                {findElementByKey('texte_bulletin_note_footer')}
              </p>
              <div className="newsletter-wrapper">
                <div id="mc_embed_signup2">
                  <form
                    id="mc-embedded-subscribe-form2"
                    name="mc-embedded-subscribe-form"
                    className="validate "
                    target="_blank"
                    noValidate
                  >
                    <div id="mc_embed_signup_scroll2">
                      <div className="mc-field-group input-group form-floating">
                        <input
                          type="email"
                          name="EMAIL"
                          className="required email form-control"
                          placeholder="ADDRESSE EMAIL"
                          id="mce-EMAIL2"
                        />
                        <label htmlFor="mce-EMAIL2">
                          {findElementByKey('address_mail_footer')}
                        </label>
                        <button
                          name="subscribe"
                          id="mc-embedded-subscribe2"
                          className="btn btn-dark btn-hover"
                        >
                          {findElementByKey('rejoindre_footer')}
                        </button>
                      </div>
                      <div
                        id="mce-responses2"
                        className="clear"
                      >
                        <div
                          className="response"
                          id="mce-error-response2"
                          style={{ display: 'none' }}
                        ></div>
                        <div
                          className="response"
                          id="mce-success-response2"
                          style={{ display: 'none' }}
                        ></div>
                      </div>
                      <div
                        style={{ position: 'absolute', left: '-5000px' }}
                        aria-hidden="true"
                      >
                        <input
                          type="text"
                          name="b_ddc180777a163e0f9f66ee014_4b1bcfa0bc"
                          tabIndex={-1}
                          defaultValue=""
                        />
                      </div>
                      <div className="clear"></div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row gy-6 gy-lg-0"
          style={{ marginTop: '30px' }}
        >
          <div className="col-md-5 col-lg-4 col-xl-3">
            <nav className="nav social ">
              <a
                href="https://www.facebook.com/blkwlkr"
                target="_blank"
              >
                <img
                  src="/img/svg/square-facebook-brands.svg"
                  className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3"
                  style={{ width: '1rem', height: '1rem' }}
                  alt=""
                />
              </a>
              <a
                href="https://www.facebook.com/blkwlkr"
                target="_blank"
              >
                <img
                  src="/img/svg/linkedin-brands.svg"
                  className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3"
                  style={{ width: '1rem', height: '1rem' }}
                  alt=""
                />
              </a>
              <a
                href="https://www.facebook.com/blkwlkr"
                target="_blank"
              >
                <img
                  src="/img/svg/square-twitter-brands.svg"
                  className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3"
                  style={{ width: '1rem', height: '1rem' }}
                  alt=""
                />
              </a>
              <a
                href="https://www.facebook.com/blkwlkr"
                target="_blank"
              >
                <img
                  src="/img/svg/square-youtube-brands.svg"
                  className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3"
                  style={{ width: '1rem', height: '1rem' }}
                  alt=""
                />
              </a>
              <a
                href="https://www.facebook.com/blkwlkr"
                target="_blank"
              >
                <img
                  src="/img/svg/square-instagram-brands.svg"
                  className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3"
                  style={{ width: '1rem', height: '1rem' }}
                  alt=""
                />
              </a>
            </nav>
          </div>
          <div className="col-12 col-md-7 col-lg-6 col-xl-5 d-flex mt-1">
            <nav className="nav social flex-column flex-md-row d-flex">
              <div>
                <button
                  onClick={() => setLanguage()}
                  className="nav-link border-0 bg-transparent p-0 d-flex"
                  style={{ color: 'white' }}
                >
                  <img
                    src="/img/svg/globe-solid.svg"
                    className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-2"
                    style={{ width: '0.9rem', height: '0.9rem' }}
                    alt=""
                  />{' '}
                  {currentLanguage}
                </button>
              </div>
              <div className="d-flex mx-0 mx-md-2">
                <img
                  src="/img/svg/location-dot-solid.svg"
                  className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-2"
                  style={{ width: '0.9rem', height: '0.9rem' }}
                  alt=""
                />
                {findElementByKey('addresse_value')}
              </div>
            </nav>
          </div>

          <div className="col-md-12 col-lg-2">
            <div
              className="d-flex justify-content-center flex-column flex-xl-row align-items-start align-items-lg-center justify-content-lg-start"
              data-cues="slideInDown"
              data-group="page-title-buttons"
              data-delay="200"
            >
              <span>
                <a className="btn btn-dark btn-icon btn-icon-start rounded me-2 btn-footer">
                  <i className="uil uil-apple"></i> App Store
                </a>
              </span>
              <span className="mt-4 mt-xl-0 googlePlay">
                <a className="btn btn-dark btn-icon btn-icon-start rounded btn-footer">
                  <i className="uil uil-google-play"></i> Google Play
                </a>
              </span>
            </div>
          </div>
        </div>
        <div
          className="row gy-8 gy-lg-0"
          style={{ marginTop: '60px' }}
        >
          <div className="text-center">
            <p style={{ fontSize: '12px', fontWeight: '300' }}>
              {findElementByKey('copyright_footer')}&nbsp;
              {findElementByKey('text_copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
