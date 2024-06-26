'use server'

import { revalidatePath } from "next/cache";
import { updateUser } from "../../data-access/users";

export async function updateNameAction(userId: string, formData: FormData) {
        const newName = formData.get("name") as string;
        await updateUser(userId, newName);
        revalidatePath(`/step-4/action-file/${userId}`) //reload the path
}
