import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `blackwalker`,
    siteUrl: `https://www.blackwalker.com`,
  },
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-sass',
    `gatsby-plugin-typescript`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    // ...other CSS plugins
    'gatsby-plugin-css-customs',
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        cssLoaderOptions: {
          camelCase: false,
          exportLocalsConvention: false,
          namedExport: false,
          postCssPlugins: [require(`postcss-preset-env`)({ stage: 0 })],
        },
      },
    },
    {
      resolve: `gatsby-source-strapi`,
      options: {
        apiURL: 'https://cms-bw.herokuapp.com/admin',
        accessToken:
          'd9a4558feac4ec632d8c09bd5224350200fef48f571eeee124101bc51e3b6f3f46a5e0920cd6b70ee40396a502585374849fb7365d77d2f1e912c78224f30cd0b7bf482ad1e97364ebc52fe728cf94514354dd5401e4e98f047307bc65f61d0ca24c3246185af952433d93b1eca498591c4a7e3b893b1689b696a2efd21b84c9',
        collectionTypes: ['bw-asset', 'bw-page', 'bw-image'],
        queryLimit: 1000,
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-transformer-remark',
  ],
}

export default config
