import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";


export default function Header() {

  const { user, error, isLoading } = useUser();


  return(
    <>
    
      <header className="w-full px-4">
        <div className="container flex justify-between items-center mx-auto py-4">
          <div className="logo mr-[20%]">
            <Link href="/">
              COVERLETTER.PRESS
            </Link>
          </div>
          <div className="navigation flex justify-end items-center gap-8 bg-white py-4 px-6 flex-grow rounded-md border border-black">
            {!user && !isLoading && (
              <>
                <Link className="button button--secondary" href="/api/auth/login">
                  Log in
                </Link>
                <Link className="button " href="api/auth/signup">
                  Signup Now
                </Link>
              </>
            )}
            {user && (
              <>
                <Link href="/">
                  Dashboard
                </Link>
                {/* <Link href="/cover-letter">
                  Create New
                </Link> */}
                <Link href="/profile">
                  Profile
                </Link>
                <Link className="button button" href="/api/auth/logout">
                  Logout
                </Link>
              </>
            )}

          </div>
        </div>
      </header>
    </>
  )
}