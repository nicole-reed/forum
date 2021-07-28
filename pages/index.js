import { useSession, signIn, signOut } from 'next-auth/client'
import Header from '../components/header'

export default function Home() {
  return (
    <div>
      <Header />
    </div>
  )
}