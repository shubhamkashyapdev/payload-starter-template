import { CollectionConfig } from 'payload/types'
import { publishedPosts } from '../access/postsAccess'
import { SlugField, TitleField } from '../fields'
import slug from '../fields/slug'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    defaultColumns: ['title', 'author', 'category', 'tags', 'status'],
    useAsTitle: 'title'
  },
  access: {
    read: publishedPosts
  },
  fields: [
    TitleField,
    slug(),
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user.id,
      required: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'publishedDate',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'content',
      type: 'richText'
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          value: 'draft',
          label: 'Draft'
        },
        {
          value: 'published',
          label: 'Published'
        }
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar'
      }
    }
  ]
}

export default Posts
