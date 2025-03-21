import { auth, signOut, signIn } from '@/auth';
import Link from 'next/link';
import React from 'react';
import Image from "next/image"

import { PlusCircle, ImagePlus, X, Keyboard} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { revalidatePath } from 'next/cache';

const Navbar = async () => {
  const session = await auth();

  return (
    <div className='px-5 py-3  bg-white shadow-sm font-work-sans  text-black flex items-center  justify-between'>
      
      <div className='text-center ml-5 flex items-center gap-2'>
        <Keyboard />
        keebit
      </div>

      {session && session?.user ? (
        <div className='flex gap-5 items-center mr-5'>


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{session.user.name}</Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/profile/${session.user.id}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/'>Collections</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form
                  action={async ()=> {
                    "use server";
                    await signOut();
                    revalidatePath("/"); 
                  }}
                >
                  <button type='submit'>Logout</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>

          <Image
              src={session?.user.image ?? '/default-profile.png'}
              alt={`Profile Picture of ${session.user.name}`}
              width={42}
              height={42}
              className="rounded-full"
          />
        </div>

      ) : (
        <Link href="/login">Sign Up</Link>

      )}

    </div>
  );
};

export default Navbar;
