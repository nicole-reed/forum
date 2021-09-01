import Header from './header'
import Nav from './nav'

export default function Layout({ children }) {


    return (
        <>
            <div className='header'>
                <a href='/' className='navItem' className='logo'>DN</a>
                <Nav />
            </div>
            <main>
                {children}
            </main>
        </>
    )
}