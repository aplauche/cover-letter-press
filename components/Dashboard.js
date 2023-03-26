import Link from "next/link"


export default function Dashboard({items = false}){


 items = ["number 1", "lorem ipsum", "final"]

  return (
    <>

      <div className="my-[50px] w-100 flex justify-between items-center border-b border-black">
        <h2>My Cover Letters</h2>
        <Link className="button" href="/cover-letter">
          Create New
        </Link>
      </div>

      {!items || items.length < 1 ? (
          <div className="bg-secondary rounded-md py-20 text-center mb-20">
            It looks like you haven't generated any cover letters yet...
          </div>
      ): (
        <div className="my-10 grid grid-cols-3 gap-4">

          {items.map(item => (
            <div key={item} className="bg-white rounded-md p-4">
              <h3 className="text-2xl">{item}</h3>


            </div>
          ))}
        </div>
      )}
    

    
    </>
  )
}