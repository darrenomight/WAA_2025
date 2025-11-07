import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/app/lib/jwt'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    // Redirect if not authenticated
    if (!accessToken || !verifyAccessToken(accessToken)) {redirect('/login')}
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome! You are logged in.</p>
        </div>
    )
}