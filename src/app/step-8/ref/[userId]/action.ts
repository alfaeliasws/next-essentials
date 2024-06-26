'use server'

import { revalidatePath } from "next/cache";
import { updateUser } from "../../data-access/users";

export async function updateNameAction(prevState: {
    userId: string
}, formData: FormData) {
    //sleep 1 second
	await new Promise((resolve) => setTimeout(resolve, 1000))

    const userId = prevState.userId;
    const newName = formData.get("name") as string;
    await updateUser(userId, newName);
    revalidatePath(`/step-8/ref/${userId}`) //reload the path

    return {
        userId: userId,
        name: "",
        message: "success"
    }
}
