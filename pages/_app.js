import '../styles/globals.css'
import Link from "next/link"


function MyApp({ Component, pageProps }) {
  return(
    <body className="bg-neutral-900">
    <div className="">
      <nav className="p-6 mb-40">
        <p className="text-4xl font-bold text-zinc-50 flex justify-center">bunker</p>
        <div className="flex mt-4 justify-center">
          <Link href="/">
            <a className="mr-6 text-zinc-50">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-zinc-50">
              Sell
            </a>
          </Link>
          <Link href="/vault">
            <a className="mr-6 text-zinc-50">
              My vault
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-zinc-50">
              Dashboard
            </a>
          </Link>
        </div>


      </nav>
      <div className="mx-60">
        <Component {...pageProps}/>
      </div>
    </div>
    </body>
  )
}

export default MyApp
