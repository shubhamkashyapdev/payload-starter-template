import { buildConfig } from 'payload/config'
import path from 'path'
import { Categories, Posts, Tags, Users } from './collections'

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug
  },
  collections: [Users, Posts, Categories, Tags],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql')
  }
})
