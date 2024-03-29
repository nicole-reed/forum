import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from 'react-toast-notifications'
import './styles.css'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      options={{
        // Client Max Age controls how often the useSession in the client should
        // contact the server to sync the session state. Value in seconds.
        // e.g.
        // * 0  - Disabled (always use cache value)
        // * 60 - Sync session state with server if it's older than 60 seconds
        clientMaxAge: 0,
        // Keep Alive tells windows / tabs that are signed in to keep sending
        // a keep alive request (which extends the current session expiry) to
        // prevent sessions in open windows from expiring. Value in seconds.
        //
        // Note: If a session has expired when keep alive is triggered, all open
        // windows / tabs will be updated to reflect the user is signed out.
        keepAlive: 0
      }}
      session={session} >
      <ToastProvider autoDismiss={true} autoDismissTimeout='2000' placement='bottom-center'>

        <Component {...pageProps} />
      </ToastProvider>




    </SessionProvider>
  )
}