import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react"

export default function NavbarWrapper() {
    return(
        <main>
            <SessionProvider>
                <Navbar />
            </SessionProvider>
        </main>
    )
}