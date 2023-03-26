import Link from "next/link"
import { useEffect, useState } from "react"


export default function Dashboard({items = false}){


 //items = ["number 1", "lorem ipsum", "final"]

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getPosts(){
      setLoading(true)
      try {
        const res = await fetch('/api/get-posts', {
          method: "GET",
          headers: {
            'content-type': 'application/json'
          },
        })

        const json = await res.json()

        setPosts(json.posts)
        setLoading(false)

      } catch(e){
        console.log(e)
        setLoading(false)
      }
    }

    getPosts()

  }, [])



  return (
    <>

      <div className="my-[50px] w-100 flex justify-between items-center border-b border-black">
        <h2>My Cover Letters</h2>
        <Link className="button" href="/cover-letter">
          Create New
        </Link>
      </div>

      {loading && (
        <div className="w-full text-center my-10">

          Loading...

        </div>
      )}

      {!loading && (!posts || posts.length < 1) ? (
          <div className="bg-secondary rounded-md py-20 text-center mb-20">
            It looks like you haven't generated any cover letters yet...
          </div>
      ) : (
        <div className="my-10 grid grid-cols-3 gap-4">

          {posts.map(post => (
            <Link key={post._id} href={`/cover-letter/${post._id}`}>
              <div className="bg-white rounded-md p-4 border hover:border-black hover:shadow-md transition-all">
                <h3 className="text-2xl font-bold mb-1">{post.company}</h3>
                <p className="text-lg mb-0">{post.jobTitle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    

    
    </>
  )
}