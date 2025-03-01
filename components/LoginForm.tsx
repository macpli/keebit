import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth, signIn } from "@/auth"
import Link  from "next/link"
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { executeAction } from "@/lib/executeAction"

export async function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const session = await auth();
  if(session) redirect("/");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData: FormData) => {
            "use server";
            await executeAction({
              actionFn: async () => {
                await signIn("credentials", formData);
              }
            })
          }}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="kowalski@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>

            </div>
          </form>

          <form className="mt-4" action={async () => {
                      "use server";
                      await signIn('github', { prompt: "login", redirectTo: '/' }); 
                    }}>
              <Button variant="outline" className="w-full" type="submit">
                Login with Github
              </Button>
          </form>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
