import { LoginErrors } from '@/app/types/error';
import { login } from '@/hooks/Auth';
import { toast } from '@/hooks/use-toast';
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export const LoginForm = () => {
  const { login: contextLogin } = useUser();
  const router = useRouter();
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loginForm, setLoginForm]  = useState({
    email_address: '',
    password: '',
  });

  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    email_address: false,
    password: false,
  });

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await login(loginForm);
      if(result.status === 201){
        contextLogin(result.data);
        router.push('/dashboard');
        toast({
          className: 'success_message',
          description: result.message,
        })
      }else{
        toast({
          className: 'error_message',
          description: result.message,
        })
      }
    } catch (error) {
      console.log('ERROR: signIn function: ', error)
      toast({
        className: 'error_message',
        description: 'Error creating location data',
      })
      setLoginForm({
          email_address: '',
          password: '',
        });
    }
    
  };
  
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    const validation = formSchema.safeParse({ ...loginForm, [name]: value });
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    
  }

  const formSchema = z.object({
    email_address: z.string().min(1, {message:'Email is required*'}).email({message: 'Must be a valid email.'}),
    password: z.string().min(1, {message:'Password is required*'})
  })

  useEffect(() => {
    if (Object.keys(loginForm).length) {
        const validateField = (name, value) => {
            try {
              const pickField = { [name]: true } as Record<keyof typeof formSchema.shape, true>;
                formSchema.pick(pickField).parse({ [name]: value });
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            } catch (error) {
                if (error instanceof z.ZodError) {
                    setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
                }
            }
        };
        Object.keys(loginForm).forEach(key => validateField(key, loginForm[key]));
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [loginForm]);


  return (
    <div className="mt-7">
      <form onSubmit={signIn} className="space-y-3">
        <div>
          <label htmlFor="email_address" className="block text-sm font-medium leading-6 text-gray-900">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email_address"
              name="email_address"
              type="email"
              required
              autoComplete="email"
              value={loginForm.email_address}
              onChange={onValueChange} 
              className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            {touchedFields.email_address && errors.email_address && (
                  <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.email_address}</p>
              )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={loginForm.password}
              onChange={onValueChange}
              className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            {touchedFields.password && errors.password && (
                  <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.password}</p>
              )}
          </div>
        </div>

        <div className='pt-3'>
          <button
            type="submit"
            className="flex w-full  justify-center rounded-md bg-[#b00202] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-300">
            Sign in
          </button>
        </div>
    </form>
    </div>
    
  );
};
