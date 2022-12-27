import { CollectionConfig } from 'payload/types'
import { getHashedOTP, verifyHashedOTP } from './hooks/bcrypt'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    verify: {
      generateEmailHTML: ({ req, token, user }) => {
        console.log({ user })
        const url = `https://yourfrontend.com/verify?token=${token}`
        console.log(url)

        return token
      }
    },
    maxLoginAttempts: 50,
    lockTime: 600 * 1000
  },
  admin: {
    useAsTitle: 'email'
  },
  access: {
    read: () => true
  },
  fields: [
    // Email added by default
    {
      name: 'firstName',
      type: 'text',
      required: true
    },
    {
      name: 'lastName',
      type: 'text'
    },
    {
      name: 'displayName',
      type: 'text',
      unique: true
    },
    {
      name: 'mobileNumber',
      type: 'text',
      unique: true
    },
    {
      name: 'gender',
      type: 'radio',
      options: [
        {
          value: 'male',
          label: 'Male'
        },
        {
          value: 'female',
          label: 'Female'
        }
      ]
    },
    {
      name: 'otp',
      type: 'text',
      admin: {
        readOnly: true
      }
    }
  ],
  endpoints: [
    {
      path: '/verify-otp/:userId',
      method: 'patch',
      handler: async (req, res, next) => {
        const userId = req.params.userId
        const user = await req.payload.findByID({
          collection: 'users',
          id: userId
        })
        const otp = req.body?.otp
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found!!'
          })
        }
        if (otp?.length !== 4) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid OTP'
          })
        }
        const isMatch = await verifyHashedOTP(otp, user.otp)
        if (isMatch) {
          try {
            await req.payload.update({
              collection: 'users',
              id: userId,
              data: {
                _verified: true
              }
            })
            res.status(200).json({
              success: true
            })
          } catch (err) {
            res.status(500).json({
              success: false
            })
          }
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid OTP'
          })
        }
      }
    }
  ],
  hooks: {
    beforeChange: [
      async ({ operation, req, data }) => {
        if (operation === 'create') {
          const { otp, hashedOTP } = await getHashedOTP()
          const body = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_USER_ID,
            accessToken: process.env.EMAILJS_ACCESS_TOKEN,
            template_params: {
              firstName: data.firstName,
              otp: otp,
              send_to: data.email
            }
          }
          const emailStatus = await fetch(
            `https://api.emailjs.com/api/v1.0/email/send`,
            {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          if (emailStatus.status !== 200) {
            throw new Error('Email Service Failed')
          }
          data.otp = hashedOTP
          return data
        }
      }
    ]
  }
}

export default Users
