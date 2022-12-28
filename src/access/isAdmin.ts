import { Access } from 'payload/config'

export const isAdmin: Access = ({ req: { user } }) => {
  if (user.role === 'admin') {
    return true
  } else {
    return false
  }
}
