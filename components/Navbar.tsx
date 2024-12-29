import { auth, signOut, signIn } from '@/auth'
import React from 'react'

const Navbar = async () => {
  const session = await auth();
  return (
    <div className='px-5 py-3 bg-white shadow-sm font-work-sans text-black'>
      {session && session?.user ? (
        <div className='flex gap-5'>
          <button>Add</button>

          <form action = { async () => {
            "use server"

            await signOut({redirectTo: "/"});
          }}>

            <button type='submit'>Logout</button>
          </form>

          <span>{session.user.name}</span>
        </div>
      ): (
        <>
          <form action={ async () => {
            "use server"

            await signIn('github')
          }}>
            <button type='submit'>Log in</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Navbar