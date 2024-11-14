'use client'
 
import { useRouter } from 'next/navigation'
 
export const Homepage_Button = () => {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}