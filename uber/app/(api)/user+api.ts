import { neon } from "@neondatabase/serverless";
import { data } from "../constants";

export async function post(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await sql(
      `insert into users (name, email, clerk_id) values ('${name}', '${email}', '${clerkId}')`
    );

    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response({ error: error }, { status: 500 });
  }
}

// See https://neon.tech/docs/serverless/serverless-driver
// for more information
