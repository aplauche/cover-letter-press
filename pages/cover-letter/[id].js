
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongo";

export default function CoverLetter({coverLetter}){




  return(
    <>
      <div className="max-w-[600px] mx-auto my-20 bg-white p-4 md:p-10 py-16 rounded-md">

        <div dangerouslySetInnerHTML={{__html: coverLetter}}></div> 

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

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.id), 
      userAuth0Id: user.sub
    })


    if(!post){
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
  
    return {
      props : {
        coverLetter: post.coverLetter
      }
    }
  }


})