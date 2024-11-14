import { z } from "zod"

// export const authLoginSchema = z.object({
//     email_address: z.string()
//     .email({message:'Must be an email format.'}
//     ).min(1, {message:'Email is required*'}),
//     password: z.string().min(1, {
//         message: "Password must be at least 3 characters.",
//     }),
// })

export const authLoginSchema = z.object({
    email_address: z.string().email(
        {message:'Must be an email format.'}
    ),
    password: z.string().min(3, {
        message: "Password must be at least 3 characters.",
    }),
})

