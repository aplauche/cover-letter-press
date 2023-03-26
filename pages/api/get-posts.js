import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongo";

export default withApiAuthRequired(async function handler(req, res){

  try {

    const {user} = await getSession(req,res)

        // connect to DB
        const client = await clientPromise;
        const db = client.db("clpdev")

        // const userProfile = await db.collection("users").findOne({auth0Id: user.sub})

        // if(!userProfile) {
        //   return {
        //     availableTokens: 0,
        //     posts: []
        //   }
        // }
      
        const posts = await db.collection("posts").find({
          userAuth0Id: user.sub
        }).sort({created: -1}).toArray()

        res.status(200).json({posts})
        return

  }catch(e){
    res.status(500).send('An Error occured...')
    return
  }

})
