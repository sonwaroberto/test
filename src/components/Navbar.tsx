import * as React from 'react'
import { useThemeContext } from '../utils/dataContext'
import $ from 'jquery'

const NavBar: React.FC = () => {
  const { findElementByKey, currentLanguage, setLanguage } = useThemeContext()

  // const handleNav = () => {
  //   console.log('handleNav')
  //   $('.navbar-nav').on('click', function () {
  //     $('.nav-item a').find('.active').removeClass('active')
  //     $(this).parent().addClass('active')
  //   })
  // }
  return (
    <header className="wrapper">
      <nav
        style={{ position: 'fixed', background: '#f1f1f1' }}
        className="navbar navbar-expand-lg classic transparent navbar-light"
      >
        <div className="container flex-lg-row flex-nowrap align-items-center">
          <div className="navbar-brand w-100">
            <a href="demo6.html">
              <span className="h1">LOGO</span>
            </a>
          </div>
          <div
            tabIndex={-1}
            className="navbar-collapse offcanvas-nav"
          >
            <div className="offcanvas-header d-lg-none d-xl-none">
              <a
                href="#"
                className="navbar-link"
              >
                Logo
              </a>
              <button
                type="button"
                className="btn-close btn-close-white offcanvas-close offcanvas-nav-close"
                aria-label="Close"
              ></button>
            </div>
            <ul className="navbar-nav">
              <li
                className="nav-item"
                x-position="done"
                onClick={(e) => console.log(e)}
              >
                <a
                  className="nav-link scroll active"
                  href="#nav_accueil"
                  onClick={(e) => console.log(e)}
                >
                  {findElementByKey('nav_accueil')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link scroll"
                  href="#nav_estimation"
                >
                  {findElementByKey('nav_estimation')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link scroll"
                  href="#nav_service"
                >
                  {findElementByKey('nav_service')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link scroll"
                  href="#nav_statistiques"
                >
                  {findElementByKey('nav_statistiques')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link scroll"
                  href="#nav_a_propos"
                >
                  {findElementByKey('nav_a_propos')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link scroll"
                  href="#nav_contact"
                >
                  {findElementByKey('nav_contact')}
                </a>
              </li>
            </ul>
          </div>
          <div className="navbar-other ms-lg-4">
            <ul
              className="navbar-nav flex-row align-items-center ms-auto"
              data-sm-skip="true"
            >
              <li className="nav-item">
                <button
                  onClick={() => setLanguage()}
                  className="nav-link border-0 bg-transparent"
                >
                  {currentLanguage}
                </button>
              </li>
              <li className="nav-item btn-gen d-none d-md-block">
                <a
                  href="https://www.blackwalker.com/book-a-car/"
                  className="btn btn-sm btn-dark rounded"
                >
                  {findElementByKey('nav_reserver')}
                </a>
              </li>
              <li className="nav-item d-lg-none">
                <div className="navbar-hamburger">
                  <button
                    className="hamburger animate plain"
                    data-toggle="offcanvas-nav"
                  >
                    <span></span>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavBar
