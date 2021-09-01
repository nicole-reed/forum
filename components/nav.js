import Link from 'next/link'
import { useSession } from 'next-auth/client'


export default function Nav() {
    const [session, loading] = useSession()
    return (
        <nav>
            <ul className='navItems'>
                <li className='navItem'>{session && session.user.name}</li>
                <li className='navItem'><Link href="/"><a>Home</a></Link></li>
                <li className='navItem'><Link href="/signin"><a>Sign In</a></Link></li>
                {/* <li className='navItem'><Link href="/topics"><a>Topics</a></Link></li> */}
                <li className='navItem'><Link href="/search"><a>Search</a></Link></li>
            </ul>
        </nav>
    )
}