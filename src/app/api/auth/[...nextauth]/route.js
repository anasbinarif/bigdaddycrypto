import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

export const authOptions = {
    pages : {
        signIn: '/login'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log({credentials})
                const res = await fetch("/your/endpoint", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const user = await res.json()

                if (res.ok && user) {
                    return user
                }
                return null
            }
        })
    ]
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };