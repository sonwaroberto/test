// Import React so that you can use JSX in HeadComponents

import * as React from 'react'
import { Script, ScriptStrategy } from 'gatsby'

const HeadComponents = [
  <Script src="/plugins.js" />,
  <Script
    src="/theme.js"
    strategy={ScriptStrategy.idle}
  />,
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
    integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ=="
    crossOrigin="anonymous"
  ></script>,
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
    crossOrigin="anonymous"
  ></script>,
]

const onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  setHeadComponents(HeadComponents)
}
export default onRenderBody
