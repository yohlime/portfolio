export async function GET() {
  const d = { 
    "m.homeserver": {
      "base_url": "https://matrix.yohli.me"
    },
    "m.identity_server": {
      "base_url": "https://vector.im"
    }
  }
  return new Response(JSON.stringify(d), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
