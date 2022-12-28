import { Field } from 'payload/types'

export const TitleField: Field = {
  name: 'title',
  type: 'text',
  required: true
}
export const SlugField: Field = {
  name: 'Slug',
  type: 'text',
  required: true,
  admin: {
    position: 'sidebar'
  }
}
