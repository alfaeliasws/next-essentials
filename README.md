# Next JS Essential Note
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
