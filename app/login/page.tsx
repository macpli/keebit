import { LoginForm } from '@/components/login-form';
import React from 'react';

export default async function LoginPage() {

  return(
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
  
    // return(
    //     <>
    //         <div className='px-5 py-3 bg-white shadow-sm font-work-sans text-black'>
    //           {session && session?.user ? (
    //             <div className='flex gap-5'>
    //               <form
    //                 action={async () => {
    //                   "use server";
    //                   await signOut({ redirectTo: "/" }); // Usuwa sesję użytkownika
    //                 }}
    //               >
    //                 <button type='submit'>Logout</button>
    //               </form>
    //               <span>{session.user.name}</span>
    //             </div>
    //           ) : (
    //             <>
    //               <form
    //                 action={async () => {
    //                   "use server";
    //                   await signIn('github', { prompt: "login" }); 
    //                 }}
    //               >
    //                 <button type='submit'>Log in</button>
    //               </form>
    //             </>
    //           )}
    //         </div>

            
    //     </>
    // )
}