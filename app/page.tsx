import { redirect } from 'next/navigation'

export default function RootPage() {
  // Server-side redirect to prevent blank page flash
  redirect('/home')
}