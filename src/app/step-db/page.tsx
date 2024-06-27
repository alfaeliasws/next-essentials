import { db } from "@/db";
import { postsTable, usersTable } from "@/db/schema";

export default async function Home() {
  
  //get data
  const post = await db.query.postsTable.findMany(); 
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        
        
        <form action={async () => {
          //post data
          'use server'

          await db.insert(usersTable).values({
            id: 1,
            age: 20,
            email: "test@example.com",
            name: "Johnson"
          })

          await db.insert(postsTable).values({
            title: "new post",
            content: "this is the newest post",
            userId: 1,
          })

        }}>
          <button>Submit</button>

          {post.map(item => {
            return (
              <div>
                {item.title}
              </div>
            )
          })}

        </form>
      </div>
    </main>
  );
}
