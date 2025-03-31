
import { auth } from "@/auth";
import UserProfile from "@/components/Profile/UserProfile"

export default async function UsersPage() {

    const session = await auth();

    return (
        <div>
            { session && session.user && <UserProfile /> }
        </div>
    );
}