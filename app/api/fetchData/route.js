"use server";
import { connectToDB } from '@/utils/database';
import Data from '@/models/datatable';

export default async function handler(req, res) {
    try {
        await connectToDB();

        // Log the current time on the server
        console.log('Server Time:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

        // Fetch the current date and time from World Time API for Asia/Kolkata
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata', {
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch time from World Time API');
        }

        const timeData = await response.json();
        console.log('Full Time Data:', timeData);

        const localDate = timeData.datetime.split('T')[0]; // Extract the date in 'YYYY-MM-DD' format
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
        return new Response("Failed to fetch Data", { status: 500 });
    }
}

export const POST = handler;
