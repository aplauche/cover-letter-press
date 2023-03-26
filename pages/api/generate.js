import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { Configuration, OpenAIApi } from "openai"
import clientPromise from "../../lib/mongo";


export default withApiAuthRequired(async function handler(req, res) {

  const {user} = await getSession(req, res)

  //connect to DB
  const client = await clientPromise;
  const db = client.db("clpdev")

  //const userProfile = await db.collection("users").findOne({auth0Id: user.sub})

  // if(!userProfile || userProfile.availableTokens < 1){
  //   res.status(403).send("You are not authorized to make this request or do not have enough tokens")
  //   return
  // }


  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  const openai = new OpenAIApi(config)

  const {jobTitle, company, name, education, skills} = req.body

  // Quick Bootleg Validation
  if(!jobTitle.trim() || !company.trim()){
    res.status(422)
    return
  }
  
  if(jobTitle.length > 80 || company.length > 80){
    res.status(422)
    return
  }


  // Let's go!
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    temperature: 0,
    max_tokens: 1000,
    prompt: `
      Write a long and detailed cover letter applying for the position of ${jobTitle},
      at the company ${company}. Mention my educational background which includes ${education}, but do not include specifics about the institution unless specified. 
      Also mention the following skills I bring to the job: ${skills}
      Sign the cover letter from ${name}.
      The cover letter content should be formatted in HTML paragraphs using only paragraph tags, no <br> tags.
      The return format must be valid JSON (with no \n or \t in the output) in the following format:
      {
        "coverLetter": Only the cover letter content goes here
        "jobTitle": the position title goes here
        "company": the company name goes here
      }
    `
  })

  console.log(response)

  // await db.collection("users").updateOne({auth0Id: user.sub}, {
  //   $inc: {
  //     availableTokens: -1
  //   }
  // })

  // Will return multiple "choices" we just grab the first
  const parsedData = JSON.parse(response.data.choices[0]?.text)

  const post = await db.collection("posts").insertOne({
    coverLetter: parsedData?.coverLetter,
    jobTitle: parsedData?.jobTitle,
    company: parsedData?.company,
    userAuth0Id: user.sub, // use the mongo db id as a foriegn key for user data
    created: new Date()
  })

  res.status(200).json({ post })
})
