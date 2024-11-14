'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { authLoginSchema } from '@/zod-schema/AuthSchema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import { redirect } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';

const LoginForm = () => {
    const router = useRouter();
    const { toast } = useToast()
    const form = useForm<z.infer<typeof authLoginSchema>>({
        resolver: zodResolver(authLoginSchema),
        defaultValues: {
          email_address: "",
          password: ""
        },
      })
     
      async function onSubmit(values: z.infer<typeof authLoginSchema>) {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email_address, password: values.password }),
              });
            if (res.status === 200) {
                console.log(res.status)
                router.push("/dashboard/home")
            }
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Invalid Credentials",
              })
        }
      }

    return (
        <Card>
            <Form {...form}>
            <CardHeader>
                <CardTitle>G-Retail</CardTitle>
                <CardDescription>Let's see what's new.</CardDescription>
            </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email_address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} autoComplete='off' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password" type='password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button onClick={()=>{}} type="submit">Login</Button>
                </form>

                </CardContent>
            </Form>
        </Card>
    )
}

export default LoginForm