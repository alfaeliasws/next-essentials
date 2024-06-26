import Image from "next/image";
import { getUser, updateUser } from "../../data-access/users";
import { revalidatePath } from "next/cache";
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

			<form className="text-black font-mono" action={async (formData: FormData) => {
				'use server' //server component
				const newName = formData.get("name") as string;
				await updateUser(user.id, newName);
				revalidatePath(`/step-3/form-integrated/${user.id}`) //reload the path
			}}>
				<input type="text" name="name" />
				<button className="bg-slate-600 hover:bg-slate-400 hover:text-black transition-all font-semibold font-mono tracking-wider ml-10 text-sm rounded-lg p-2" >Submit</button>
			</form>

    </main>
    );
}