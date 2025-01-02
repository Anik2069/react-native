import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

const posts = await sql("SELECT * FROM posts");

export async function post(request) {
    
}

// See https://neon.tech/docs/serverless/serverless-driver
// for more information
