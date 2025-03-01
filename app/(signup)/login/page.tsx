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
import { LoginForm } from "@/components/LoginForm"

export default async function LoginPage() {

  return(
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}