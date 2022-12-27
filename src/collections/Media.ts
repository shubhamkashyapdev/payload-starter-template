import { CollectionConfig } from 'payload/types';

const Media: CollectionConfig = {
    slug: 'media',
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
        }
    ],
    upload: {
        staticURL: '/media',
        staticDir: 'media',
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
        disableLocalStorage: true,
    },
};
export default Media