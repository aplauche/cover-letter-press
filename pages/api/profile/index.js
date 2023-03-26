import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { Configuration, OpenAIApi } from "openai"
import clientPromise from "../../../lib/mongo";


export default withApiAuthRequired(async function handler(req, res) {

  const {user} = await getSession(req, res)

  //connect to DB
  const client = await clientPromise;
  const db = client.db("clpdev")
 

  const {name, education, skills} = req.body

  const userProfile = await db.collection("users").updateOne({
    auth0Id: user.sub
  }, {
    $set: {    
      name: name,
      education: education,
      skills: skills,
    },
    $setOnInsert: {
      auth0Id: user.sub,
      created: new Date()
    }
  }, {
    upsert: true
  })

  res.status(200).json({ userProfile })
})
