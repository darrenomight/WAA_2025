'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function logout() {
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
        if (res.ok) {
          router.replace('/login') // redirect to login after logout
        }
      } catch (err) {
        console.error('Logout failed', err)
      }
    }
    logout()
  }, [router])

  return <p>Logging out...</p>
}