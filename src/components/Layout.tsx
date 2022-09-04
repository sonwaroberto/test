import React, { ReactElement, useContext, useEffect, useState } from 'react'
import NavBar from './Navbar'
import Footer from './Footer'
import '../../static/css/plugins.css'
import '../../static/css/style.css'
import '../../static/css/colors/aqua.css'
import '../../static/css/fonts/thicccboi.css'
import '../style/style.css'
import { Script } from 'gatsby'
import Test from './Test'
import { graphql, useStaticQuery } from 'gatsby'
import formatData from '../utils/format'
import { datasContext } from '../utils/dataContext'

const queryAsset = graphql`
  query assets {
    allStrapiBwAsset {
      nodes {
        key
        id
        localizations {
          data {
            id
            attributes {
              value
              key
            }
          }
        }
        value {
          data {
            value
          }
        }
      }
    }
  }
`
const Layout = ({ children }: { children: ReactElement }) => {
  document.body.setAttribute('data-bs-spy', 'scroll')

  const [jqueyLoaded, setJqueryLoaded] = useState(false)
  const [pluginLoaded, setPluginLoaded] = useState(false)

  const staticQuery = useStaticQuery(queryAsset)
  const assets = staticQuery.allStrapiBwAsset.nodes

  const { setValue } = useContext(datasContext)

  useEffect(() => {
    setValue(formatData(assets))
  }, [])
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
        integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ=="
        crossOrigin="anonymous"
        onLoad={() => setJqueryLoaded(true)}
      ></Script>
      {jqueyLoaded && (
        <>
          <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
            crossOrigin="anonymous"
          ></Script>
          <Script
            src="/plugins.js"
            onLoad={() => setPluginLoaded(true)}
          />
          {pluginLoaded && <Script src="/theme.js" />}
        </>
      )}
      <>
        <NavBar />
        <Test />
        <>{children}</>
        <Footer />
      </>
    </>
  )
}

export default Layout
