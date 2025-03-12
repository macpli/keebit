import { auth, signOut, signIn } from '@/auth';
import Link from 'next/link';
import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';

import { revalidatePath } from "next/cache";
import { addCollection } from "../app/(root)/_actions/addCollection";
import { signOutAction } from '@/app/(root)/_actions/signOut';

const Navbar = async () => {
  const session = await auth();

  let dialogKey = Date.now();  

  return (
    <div className='px-5 py-3  bg-white shadow-sm font-work-sans  text-black flex items-center  justify-between'>
      
      <div className='text-center ml-5'>
        keebit
      </div>

      {session && session?.user ? (
        <div className='flex gap-5 items-center mr-5'>
          <Dialog 
          key={dialogKey} 
          >
            <div className=''>
              <DialogTrigger asChild >
                <Button >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Collection
                </Button>
              </DialogTrigger>
            </div>
            
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add collection</DialogTitle>
                <DialogDescription>
                  Create your collection here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form action={async (formData: FormData)=>{
                "use server";
                await addCollection(formData);
                // dialogKey = Date.now();
                revalidatePath('/collections');
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name"  className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" name="description" className="col-span-3" / >
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{session.user.name}</Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href='/'>Collections</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form
                  action={async ()=> {
                    "use server";
                    signOutAction();
                  }}
                >
                  <button type='submit'>Logout</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      ) : (
        <Link href="/login">Sign Up</Link>

      )}

    </div>
  );
};

export default Navbar;
