import { Access } from 'payload/config'

export const publishedPosts: Access = ({ req: { user } }) => {
  if (user.role === 'admin') {
    return true
  }
  return {
    and: [
      {
        publishDate: {
          less_than: new Date().toJSON()
        },
        _status: {
          equals: 'published'
        }
      }
    ]
  }
}
