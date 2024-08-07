export default async function handler(req, res) {
    const serverTime = new Date().toISOString();

    return new Response(JSON.stringify({ serverTime }), {
        status: 200,
    });
}

export const POST = handler;