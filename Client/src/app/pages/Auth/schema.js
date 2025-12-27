import * as Yup from 'yup'

export const schema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .trim()
        .required('Email is required'),
    password: Yup.string()
        .trim()
        .required('Password is required'),
})