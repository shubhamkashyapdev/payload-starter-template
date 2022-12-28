import { buildConfig } from 'payload/config'
import path from 'path'
import { Categories, Posts, Tags, Users, Media } from './collections'
import seo from '@payloadcms/plugin-seo'
import cloudinaryPlugin from 'payload-cloudinary-plugin/dist/plugins'

// Components
import Logo from './components/Logo'
import Icon from './components/Icon'

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Payload Auth',
      favicon: '/assets/favicon.png',
      ogImage: '/assets/logo.png'
    },
    components: {
      graphics: {
        Logo,
        Icon
      }
    }
  },
  csrf: ['http://localhost:3000'],
  collections: [Users, Posts, Categories, Tags, Media],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql')
  },
  plugins: [
    seo({
      collections: ['posts'],
      uploadsCollection: 'media'
    }),
    cloudinaryPlugin()
  ]
})
