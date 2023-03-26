import { useState } from "react"



export default function CreateCoverLetter(){

  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  //const [jobTitle, setJobTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("submitted")
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          company:company, 
          jobTitle:jobTitle,
          name: "Anton Plauche",
          education: "Bachelors in Marketing and Self Taught developer",
          skills: "html, react, javascript, wordpress"
        })
      })
  
      const json = await res.json()

      // setCoverLetter(json.data.coverLetter)
  
      console.log(json)

    } catch(e){
      console.log(e)
    }

  }

  return (
    <>
      <div className="max-w-[600px] mx-auto my-20">
        <h1 className="text-center w-full">Create a Cover Letter</h1>
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
      </div>

    
    </>
  )
}