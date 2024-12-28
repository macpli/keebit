import supabase from "./lib/supabaseClient";
import { User } from "./types/user";

async function getUsers() {
  const { data: users, error } = await supabase
    .from('Users')
    .select('*')
    
  if (error) {
    console.error('Error fetching users:', error)
    return []
  }
  console.log(users)
  return users
}

async function getCollections() {
  const { data: collections, error } = await supabase
    .from('collections')
    .select('*').eq('user_id', "11111111-1111-1111-1111-111111111111")
    
  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }
  console.log(collections)
  return collections
}

export default async function UsersPage() {
  const users = await getUsers()
  const collections = await getCollections()
  return (
    <div>
      {users.map((user: User) => (
        <div key={user.id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  )
}