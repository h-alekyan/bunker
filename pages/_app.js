import '../styles/globals.css'
import Link from "next/link"

function MyApp({ Component, pageProps }) {
  return(
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-6 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Sell
            </a>
          </Link>
          <Link href="/vault">
            <a className="mr-6 text-pink-500">
              My vault
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500">
              Create
            </a>
          </Link>
        </div>


      </nav>
       <Component {...pageProps} />
    </div>

  )
}

export default MyApp
