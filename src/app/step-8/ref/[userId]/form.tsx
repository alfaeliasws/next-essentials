
'use client'

import { useEffect, useRef } from "react";
import { updateNameAction } from "./action";
import { useFormState, useFormStatus } from "react-dom";
export default function Form({userId}: {userId: string}) {
  const [state, action] = useFormState(updateNameAction, {
		userId: userId,
		name: "",
		message: ""
	})

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

