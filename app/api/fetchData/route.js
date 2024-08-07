"use server";
import { connectToDB } from '@/utils/database';
import Data from '@/models/datatable';

export default async function handler(req, res) {
    try {
        await connectToDB();

        // Log the current server time in Asia/Kolkata timezone
        const serverDate = new Date();
        const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
        const localDate = serverDate.toLocaleDateString('en-CA', options); // Format as 'YYYY-MM-DD'

        console.log('Server Time (Asia/Kolkata):', serverDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        console.log('Parsed Date:', localDate);

        // Find the document with the current date
        const oldData = await Data.findOne({ date: localDate });

        if (oldData) {
            console.log('Found Data:', oldData);
            return new Response(JSON.stringify(oldData), {
                status: 200,
            });
        } else {
            return new Response("No data found for today's date", {
                status: 404,
            });
        }

    } catch (error) {
        console.log('Error:', error.message);
        return new Response("Failed to fetch data", { status: 500 });
    }
}

export const POST = handler;
