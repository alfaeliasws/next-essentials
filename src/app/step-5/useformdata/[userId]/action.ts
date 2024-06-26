'use server'

import { revalidatePath } from "next/cache";
import { updateUser } from "../../data-access/users";

export async function updateNameAction(prevState: {
    userId: string
}, formData: FormData) {
    const userId = prevState.userId;
    const newName = formData.get("name") as string;
    await updateUser(userId, newName);
    revalidatePath(`/step-3/form-integrated/${userId}`) //reload the path

    return {
        userId: userId
    }
}
