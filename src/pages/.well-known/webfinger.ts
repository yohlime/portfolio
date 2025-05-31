export async function GET() {
  const wf = {
    subject: 'acct:emil@yohli.me',
    aliases: ['https://hachyderm.io/@yohlime', 'https://hachyderm.io/users/yohlime'],
    links: [
      {
        rel: 'http://webfinger.net/rel/profile-page',
        type: 'text/html',
        href: 'https://hachyderm.io/@yohlime',
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: 'https://hachyderm.io/users/yohlime',
      },
      {
        rel: 'http://ostatus.org/schema/1.0/subscribe',
        template: 'https://hachyderm.io/authorize_interaction?uri={uri}',
      },
    ],
  }
  return new Response(JSON.stringify(wf), {
    status: 200,
    headers: {
      'Content-Type': 'application/jrd+json',
    },
  })
}
