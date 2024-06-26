import { getUser } from "../../data-access/users";
import Form from "./form";
export default async function UserDataDynamicPage({params} : 
  {
    params: {
      userId: string
    }
  }
) {

    const user = await getUser(params.userId);
    return (
    <main className="flex min-h-screen flex-col items-center p-24">
			<div className="z-10 w-full max-w-5xl justify-between font-mono text-sm lg:flex flex-col items-center mb-20 ">
					User {user.name}
			</div>

      <Form userId={user.id}/>

    </main>
    );
}

