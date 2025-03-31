import NextAuth from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { encode } from "@auth/core/jwt";
import { pool } from "./lib/db";
 
const adapter = PostgresAdapter(pool);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {}
      },

      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) return null 

        const client = await pool.connect();

        const response = await client.query("SELECT * FROM users WHERE email = $1", [credentials.email]);
        const user = response.rows[0];
        
        if (user) {
          const validPassword = await bcrypt.compare(credentials.password.toString(), user.password);
          client.release();

          if (!validPassword) return null;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        } else {
          client.release();
          return null;
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    
    }),
  ],
  callbacks: {
    async jwt({token, account, user}){
      if(account?.provider === 'credentials'){
        token.credentials = true;
      }
      return token;
    },
  },

  jwt: {
    encode: async function(params){
      if(params.token?.credentials){
        const sessionToken = randomUUID();
        
        if(!params.token.sub){
          throw new Error("No user ID found on token");
        }
        
        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        
        if(!createdSession){
          throw new Error("Failed to create session");
        }
        return sessionToken;
      }
      return encode(params);
    },
   }
})

