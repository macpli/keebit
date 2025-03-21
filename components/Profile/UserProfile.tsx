'use client';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import * as UI from '@/components/ui/index';
import { Keyboard, Heart, MessageSquare, Share2, Users, Settings, Clock, Bookmark, PlusCircle, CalendarDays, Mail, Link2, MapPin, Edit, MoreHorizontal,
  } from "lucide-react"
import getUserInfo from '@/app/(root)/_actions/getUserInfo';

interface UserProfileProps {
    user: User
}

interface User {
    id: string;
    name: string;
    username: string;
    image: string;
    bio: string;
    location: string;
    website: string;
    email: string;
    joinDate: string;
    collectionCount: number;
    followerCount: number;
    followingCount: number;
    keyboardPreferences: string[];
    switchPreference: string;
    layoutPreference: string;
}

const UserProfile = () => {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        if (typeof userId === 'string') {
            getUserInfo(userId).then((user)=> {
                setUserInfo(user);
            });
        }
    }, [userId]);


    if(userId == null || userId == undefined || userInfo == null) {
        return;
    }

    return (
        <div className='min-h-screen bg-background'>
            <div className="relative">

                <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-primary/5 relative">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-10">
                            {Array.from({ length: 72 }).map((_, i) => (
                              <div key={i} className="border rounded-full m-1 border-primary"></div>
                            ))}
                        </div>
                      </div>
                </div>

                <div className='container px-4 mr-auto ml-auto'>
                    <div className='relative -mt-20 bg-background rounded-lg border shadow-sm p-6'>
                        <div className='flex flex-col md:flex-row gap-6'>
                            {/* Avatar and basic info */}
                             <div className="flex flex-col items-center md:items-start">
                                 <UI.Avatar className="h-32 w-32 border-4 border-background">
                                   <UI.AvatarImage src={userInfo.image || ''} alt='user avatar' />
                                   <UI.AvatarFallback className="text-4xl">
                                     {/* {user.name.charAt(0)} */}
                                     AvatarFallbackPlaceholder
                                     </UI.AvatarFallback>
                                 </UI.Avatar>

                                 <div className="mt-4 text-center md:text-left">
                                   <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                                   <p className="text-muted-foreground">
                                     @UserNamePlaceholder
                                     {/* {user.username} */}
                                   </p>
                                 </div>

                             <div className="flex gap-2 mt-4">
                               <UI.Button
                               variant={"outline"} 
                             //   variant={isFollowing ? "outline" : "default"} 
                             //   onClick={handleFollow}
                               >
                             {/* {isFollowing ? "Following" : "Follow"} */}
                                 Follow
                                 </UI.Button>
                                 <UI.Button variant="outline">
                                   <Mail className="h-4 w-4 mr-2" />
                                     Message
                                 </UI.Button>
                                 <UI.DropdownMenu>
                                   <UI.DropdownMenuTrigger asChild>
                                     <UI.Button variant="outline" size="icon">
                                       <MoreHorizontal className="h-4 w-4" />
                                     </UI.Button>
                                   </UI.DropdownMenuTrigger>
                                   <UI.DropdownMenuContent align="end">
                                     <UI.DropdownMenuItem>
                                       <Share2 className="mr-2 h-4 w-4" />
                                       Share Profile
                                     </UI.DropdownMenuItem>
                                     <UI.DropdownMenuItem>
                                       <Users className="mr-2 h-4 w-4" />
                                       View Followers
                                     </UI.DropdownMenuItem>
                                     {userInfo.id === '1' && (
                                       <>
                                                    <UI.DropdownMenuSeparator />
                                                    <UI.DropdownMenuItem>
                                                      <Edit className="mr-2 h-4 w-4" />
                                                      Edit Profile
                                                    </UI.DropdownMenuItem>
                                                    <UI.DropdownMenuItem>
                                                    <Settings className="mr-2 h-4 w-4" />
                                                        Settings
                                                    </UI.DropdownMenuItem>
                                                </>
                                            )}
                                            </UI.DropdownMenuContent>
                                        </UI.DropdownMenu>
                                     </div>
                             </div>

                                           {/* Bio and stats */}
              <div className="flex-1 mt-6 md:mt-0">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="max-w-2xl">
                    <p className="text-sm mb-4">
                        {/* {user.bio} */}
                        User bio placeholder
                        </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      {/* {user.location && ( */}
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          User Location Placeholder
                          {/* {user.location} */}
                        </div>
                      {/* )} */}
                      {userInfo
                    //   .website 
                      && (
                        <div className="flex items-center text-muted-foreground">
                          <Link2 className="h-4 w-4 mr-2" />
                          <a 
                        //   href={`https://${user.website}`} 
                          className="text-primary hover:underline">
                           userWebistePlaceholder.com
                            {/* {user.website} */}
                          </a>
                        </div>
                      )}
                      {userInfo.email && (
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          {userInfo.email}
                        </div>
                      )}
                      {userInfo
                    //   .joinDate
                       && (
                        <div className="flex items-center text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          Joined 
                          {/* {user.joinDate} */}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-6 mt-6 md:mt-0">
                    <div className="text-center">
                      {/* <p className="text-2xl font-bold">{user.collectionCount}</p> */}
                      <p className="text-xs text-muted-foreground">Collections</p>
                    </div>
                    <div className="text-center">
                      {/* <p className="text-2xl font-bold">{user.followerCount}</p> */}
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      {/* <p className="text-2xl font-bold">{user.followingCount}</p> */}
                      <p className="text-xs text-muted-foreground">Following</p>
                    </div>
                  </div>
                </div>

                {/* Keyboard preferences */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Keyboard Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* {user.keyboardPreferences?.map((pref, i) => (
                      <Badge key={i} variant="outline">
                        {pref}
                      </Badge>
                    ))} */}
                    {/* {user.switchPreference && <Badge variant="outline">{user.switchPreference} Switches</Badge>} */}
                    {/* {user.layoutPreference && <Badge variant="outline">{user.layoutPreference} Layout</Badge>} */}
                  </div>
                </div>
              </div>
                        </div>
                    </div>

             </div>
        </div>
    </div>
  )
}

export default UserProfile