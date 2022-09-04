import * as React from 'react'
import Layout from '../components/Layout'
import { HeadFC } from 'gatsby'
import { DatasContextProvider } from '../utils/dataContext'

const IndexPage = () => {
  return (
    <DatasContextProvider>
      <Layout>
        <></>
      </Layout>
    </DatasContextProvider>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>landing page</title>
