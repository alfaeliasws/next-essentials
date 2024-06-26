type User = {
    id: string,
    name: string
}

(global as any).user = {
    id: "1",
    name: "Johnson"
} as User

export async function getUser(userId: string) {
    return global.user as any
}

export async function updateUser(name: string) {
    return (global.user as User).name = name
}