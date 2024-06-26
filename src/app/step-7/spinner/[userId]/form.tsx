
'use client'

import { useRef } from "react";
import { getUser, updateUser } from "../../data-access/users";
import { updateNameAction } from "./action";
import { useFormState, useFormStatus } from "react-dom";
export default function Form({userId}: {userId: string}) {
  const [state, action] = useFormState(updateNameAction, {userId: userId, })
	
	return (
			<form 
				className="text-black font-mono" 
				action={action}>
				<input type="text" name="name" />
				<SubmitButton />
			</form>
    );
}

export function SubmitButton () {
	const status = useFormStatus()
	
	return (
		<button className="bg-slate-600 hover:bg-slate-400 hover:text-black transition-all font-semibold font-mono tracking-wider ml-10 text-sm rounded-lg p-2" >
			{status.pending ? "Saving..." : "Save"}
		</button>
	)

}

