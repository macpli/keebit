import Navbar from "@/components/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";
import { SessionProvider } from "next-auth/react";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

    return(
        <main>
            <SessionProvider>
                <Navbar />
                {children}
            </SessionProvider>
        </main>
    )
}