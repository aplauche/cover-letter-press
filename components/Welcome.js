import Link from "next/link";


export default function Welcome(){


  return (
    <>

      <div className="text-center py-20 px-4 md:px-20 my-10 bg-white rounded-xl border border-black">
        <h1>Tired of Writing Endless Cover Letters?</h1>
        <p>Leverage AI to produce cover letters tailored to the jobs you care about in minutes.</p>
        <div className="flex gap-4 justify-center mt-16">
          <Link className="button" href="api/auth/signup">
            Create an Account
          </Link>
        </div>

      </div>

    </>
  )
}