# Next JS Essentials
[[Fleeting Notes MOC]]
### INSTALLATION
```
npx create-next-app@latest .
```
### APP ROUTER
- It will make automatic router from the /src/app/ folder
- Example: 
	- /src/app/page will route to /
	- /src/app/user/page will route to /user
### DATA ACCESS
- Use data-access folder with ts file inside it
- await get user
### DYNAMIC PATH
- Use square brackets for dynamic path
### FORM ACTION
- Use Form action to record changes of the input
- Form action should be use server type so every action should be recorded to the api (be careful of this design)
- Form action should be async
- Form action better to use revalidatePath method from next/cache so it display correct data after submit
```ts
<form className="text-black font-mono" action={async (formData: FormData) => {
	'use server' //server component
	const newName = formData.get("name") as string;
	await updateUser(user.id, newName);
	revalidatePath(`/step-3/form-integrated/${user.id}`) //reload the path
}}>
```
### USEFORMSTATE
- To process form state in next js app
```ts
const [state, action] = useFormState(updateNameAction, {
	userId: userId,
	name: "",
	message: ""
})
```
- updateNameAction is a function of server action
```ts
export async function updateNameAction(prevState: {
    userId: string
}, formData: FormData) {
    //sleep 1 second
	await new Promise((resolve) => setTimeout(resolve, 1000))

    const userId = prevState.userId;
    const newName = formData.get("name") as string;
    await updateUser(userId, newName);
    revalidatePath(`/step-3/form-integrated/${userId}`) //reload the path

    return {
        userId: userId,
        name: "",
        message: "success"
    }
}
```
- The first argument is the Function of action
- The second one is the expected return structure
- We put destructurization of result of the UseFormState and use the action part (array[1]) of the array destructure for the html form action attribute
### USEFORMSTATUS
- Use Form Status is the one that put suspense (spinner or loading) in Next JS button
```ts
export function SubmitButton () {
	const status = useFormStatus()
	
	return (
		<button className="bg-slate-600 hover:bg-slate-400 hover:text-black transition-all font-semibold font-mono tracking-wider ml-10 text-sm rounded-lg p-2" >
			{status.pending ? "Saving..." : "Save"}
		</button>
	)

}
```
### REFERENCE
- Usually to make the input empty again
```ts
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if(state.message === "success"){
			formRef.current?.reset()
		}
	}, [state])
return (
<form 
	className="text-black font-mono" 
	ref={formRef}
	// ...
>
)
```
### NEXT JS DATABASE TURSO SQLITE - DRIZZLE
- Go to turso
- Create database
- Go to drizzle, run this two commands
```shell
npm i drizzle-orm
npm i -D drizzle-kit
```
### NEXT JS DATABASE SET UP TURSO
- Install dotenv and @libsql/client
```shell
npm i dotenv @libsql/client
```
- env file
```env
TURSO_CONNECTION_URL=aaaaaaa
TURSO_AUTH_TOKEN=aaaaaaaa
```
### NEXT JS DATABASE SET UP DRIZZLE
- Create db folder in src folder
- Create index.ts file
```ts
import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

config({path: '.env'})

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN
})

export const db = drizzle(client)

```
### NEXT JS DATABASE SCHEMA FILE
- Create schema file to create table and mapping the table
```ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users",{
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").unique().notNull()
});

export const postsTable = sqliteTable("posts",{
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id, {onDelete: "cascade"}),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updated_at", {mode: "timestamp"}).$onUpdate(()=> new Date())
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferInsert

export type InsertPost = typeof postsTable.$inferInsert
export type SelectPost = typeof postsTable.$inferInsert
```
### NEXT JS DB DRIZZLE CONFIG
- Create drizzle.config.ts file in the root level (one level as .env)
```ts
import { config } from 'dotenv';
import {defineConfig} from "drizzle-kit";

config({path: ".env"})

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
})
```
### NEXT JS DB CONNECT To TURSO
- Connect to turso after having the config file
```shell
npx drizzle-kit push
```
### NEXT JS POST AND GET DATA 
- Make sure to have schema in index.ts db export file
```ts
import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

config({path: '.env'})

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

export const db = drizzle(client, { schema })
```
- Post Code
```ts
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
```
- Get Code
```ts
//get data
const post = await db.query.postsTable.findMany(); 
```
### COMPLETE FILE
```tsx
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
```