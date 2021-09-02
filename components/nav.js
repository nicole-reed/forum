import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect'


export default function Nav() {
    const [session, loading] = useSession()
    const router = useRouter()

    return (
        <nav>
            <ul className='navItems'>
                {session ?
                    <li className='navItem'><Link href={`/users/${session && session.user.id}`} ><a className={router.pathname == `/users/${session && session.user.id}` ? "active" : ""}>{session && session.user.name}</a></Link></li>
                    : <li className='navItem'><Link href={`/api/auth/signin`}><a className={router.pathname == "/signin" ? "active" : ""}>Sign In</a></Link></li>
                }

                <li className='navItem'><Link href="/"><a className={router.pathname == "/" ? "active" : ""}>Home</a></Link></li>
                {isMobile && <li className='navItem'><Link href="/topics"><a className={router.pathname == "/topics" ? "active" : ""}>Topics</a></Link></li>}
                <li className='navItem'><Link href="/search"><a className={router.pathname == "/search" ? "active" : ""}>Search</a></Link></li>
            </ul>
        </nav>
    )
}