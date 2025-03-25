import Navbar from "@/components/Navbar";
import { auth, signOut, signIn } from '@/auth';
import { redirect } from "next/navigation";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
      const session = await auth();
    
     if(!session) {
        redirect("/login");
      }
    
      if (!session || !session.user || !session.user.id) {
            return <div>Please log in to view your collections.</div>;
      }  

    return(
        <main>
            <Navbar />
            {children}
        </main>
    )
}