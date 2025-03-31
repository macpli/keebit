'use client';
import { signIn, signOut, useSession } from "next-auth/react"
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from "next/image"
import getUserId from "@/app/(root)/_actions/getUserId";

import defaultUserImage from '../public/default-user-image.png';
import { Keyboard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import BackButton from './BackButton';

const Navbar = () => {
  const { data: session } = useSession()
  const [userId, setUserId] = React.useState('');

  useEffect(() => {
      getUserId().then(data => {
        if (data) {
          setUserId(data);
        }
      });
    }, [])


  return (
    <div className='px-5 py-3  bg-white shadow-sm font-work-sans  text-black flex items-center  justify-between'>
      
      <div className='text-center ml-5 flex items-center gap-2'>
        <Keyboard />
        keebit
        
        <BackButton />
        
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
              <DropdownMenuItem asChild>
                <Link href={`/profile/${userId}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/'>Collections</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                
                <button onClick={() => signOut()} className='w-full text-left'>Logout</button>
                
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>

          { (session?.user.image ?? '').length > 0 ? (
            
          <Image
              src={session?.user.image ?? ''}
              alt={`Profile Picture of ${session.user.name}`}
              width={42}
              height={42}
              className="rounded-full"
          />
          ) : (
              <Image src={defaultUserImage}
              alt={`Profile Picture of ${session.user.name}`}
              width={42}
              height={42}
              className="rounded-full"
              />
          )}

        </div>

      ) : (
        <Link href="/login">Sign Up</Link>

      )}

    </div>
  );
};

export default Navbar;
