
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
 
export default function SignIn() {
    return (
        <div className="flex mt-[10%] justify-center items-center">
            <div className="flex flex-col gap-14 p-16 rounded-3xl justify-center items-center bg-slate-800">
                <h1 className="text-2xl font-semibold underline">Sign In</h1>

                <form
                    action={async () => {
                        "use server"
                        await signIn("google", {redirectTo: '/'})
                    }}
                    >
                    <Button variant={"secondary"} type="submit" className="text-lg bg-red-500">
                        SignIn with Google
                    </Button>
                </form>
            </div>
        </div>
    )
} 