import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongo";

import { useEffect, useState } from "react"
import { useRouter } from "next/router";



export default function CreateCoverLetter({savedName, savedEducation, savedSkills}){

  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [loading, setLoading] = useState(false)
  const [messageNumber, setMessageNumber] = useState(0)

  const router = useRouter()


  const messages = [
    "Forging impressive credentials...",
    "Pretending to be passionate about boring things...",
    "Making lofty claims...",
    "Overselling skills and capabilities...",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("submitted")
    setLoading(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          company:company, 
          jobTitle:jobTitle,
          name: savedName,
          education: savedEducation,
          skills: savedSkills
        })
      })
  
      const json = await res.json()

      // setCoverLetter(json.data.coverLetter)

      setLoading(false)


      router.push('/')
  

    } catch(e){
      console.log(e)
      setLoading(false)
    }

  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageNumber((messageNumber + 1) % messages.length); 
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [messageNumber]);

  return (
    <>
      <div className="max-w-[600px] mx-auto my-20">
        <h1 className="text-center w-full">Create a Cover Letter</h1>
        {loading ? (
          <div className="py-20 mx-auto w-full">
            <p className="w-full text-center">{messages[messageNumber]}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="jobTitle">Job Title</label>
            <input 
              type="text" 
              value={jobTitle}
              name="jobTitle"
              id="jobTitle"
              onChange={(e) => {setJobTitle(e.target.value)}}
            />
          </div>
          <div>
            <label htmlFor="company">Company Name</label>
            <input 
              type="text" 
              value={company}
              name="company"
              id="company"
              onChange={(e) => {setCompany(e.target.value)}}
            />
          </div>

          <button type="submit" className="button">Create Now</button>

        </form>
        )}

      </div>

    
    </>
  )
}

export const getServerSideProps = withPageAuthRequired({

  async getServerSideProps(ctx){
    const {user} = await getSession(ctx.req, ctx.res)

    // connect to DB
    const client = await clientPromise;
    const db = client.db("clpdev")
  
    const profile = await db.collection("users").findOne({
      auth0Id: user.sub
    })
  
    return {
      props : {
        savedName: profile?.name,
        savedEducation: profile?.education,
        savedSkills: profile?.skills
      }
    }
  }


})