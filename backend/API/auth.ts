import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const session = await auth()

  if (!('userId' in session) || !session.userId) {
    return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 })
  }

  return new Response(JSON.stringify({ userId: session.userId }))
}