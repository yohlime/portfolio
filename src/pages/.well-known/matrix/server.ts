export async function GET() {
  const d = { "m.server": "matrix.yohli.me:443" }
  return new Response(JSON.stringify(d), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
