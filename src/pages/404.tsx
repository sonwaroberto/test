import * as React from "react"
import { Link, HeadFC } from "gatsby"

const NotFoundPage = () => {
  return (
    <main>
      <h1>Page not found</h1>
      <Link to="/">Go home</Link>.
    </main>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
