import { useEffect, useState } from "react"

import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import clientPromise from "../lib/mongo";



export default function Profile({savedSkills, savedName, savedEducation}){

  const [name, setName] = useState(savedName)
  const [education, setEducation] = useState(savedEducation)
  const [skills, setSkills] = useState(savedSkills)
  const [edited, setEdited] = useState(false)
  const [loading, setLoading] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name:name, 
          education:education,
          skills: skills
        })
      })
  
      const json = await res.json()
  
      setEdited(false)
      setLoading(false)

    } catch(e){
      console.log(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    if(name != savedName || education != savedEducation || skills != savedSkills){
      setEdited(true)
    } else {
      setEdited(false)
    }
  }, [name, education, skills])

  return (
    <>
    
    <div className="max-w-[600px] mx-auto my-20">
        <h1 className=" w-full">Create your profile:</h1>
        <p className="border-b border-black pb-4">The following information will be used on all generated cover letters.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              value={name}
              name="name"
              id="name"
              onChange={(e) => {setName(e.target.value)}}
            />
          </div>
          <div>
            <label htmlFor="education">Education background</label>
            <input 
              type="text" 
              placeholder="Ex: Masters in Computer Science from University of Michigan"
              value={education}
              name="education"
              id="education"
              onChange={(e) => {setEducation(e.target.value)}}
            />
          </div>
          <label htmlFor="education">Skills to include (comma seperated)</label>
          <textarea 
            name="skills" 
            id="" 
            rows="6" 
            draggable={false} 
            value={skills} 
            onChange={(e) => {setSkills(e.target.value)}}
          />
          {edited && !loading ? (
            <button type="submit" className="button">Save Info</button>
          ) : (
            <button disabled type="submit" className="button">{loading ? "Saving..." : "Information up to date"}</button>
          )}

        </form>
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
  
    //const userProfile = await db.collection("users").findOne({auth0Id: user.sub})

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