import { signIn, signOut, useSession } from 'next-auth/react'
import styles from '../styles/header.module.css'

export default function Auth() {
    const { data: session } = useSession()
    if (session) {
        return (

            <div>
                {/* <span style={{ backgroundImage: `url(${session.user.image})`, margin: 'auto' }} className={styles.avatar} /> */}
                <button className='form-btn' onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>Sign out</button>
            </div>

        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )

    // return (
    //     <header className='auth'>
    //         <noscript>
    //             <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
    //         </noscript>
    //         <div className={styles.signedInStatus}>
    //             <p>
    //                 {!session && <>
    //                     <span className={styles.notSignedInText}>You are not signed in</span>
    //                     <a
    //                         href={`/api/auth/signin`}
    //                         className={styles.buttonPrimary}
    //                         onClick={(e) => {
    //                             e.preventDefault()
    //                             signIn()
    //                         }}
    //                     >
    //                         Sign in
    //           </a>
    //                 </>}
    //                 {session && <div className='sign-out'>
    //                     {session.user.image && <span style={{ backgroundImage: `url(${session.user.image})` }} className={styles.avatar} />}

    //                     <a href={`/api/auth/signout`} className={styles.button}
    //                         onClick={(e) => {
    //                             e.preventDefault()
    //                             signOut({ redirect: true, callbackUrl: "/" })
    //                         }}>
    //                         Sign out
    //                     </a>
    //                 </div>}
    //             </p>
    //         </div>

    //     </header>
    // )
}