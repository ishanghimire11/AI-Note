export async function POST(req: Request) {
  try {
    const body = await req.json();
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
