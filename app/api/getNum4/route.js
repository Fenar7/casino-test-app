"use server";
import { connectToDB } from '@/utils/database';
import Data from '@/models/datatable';

export default async function handler(req, res) {
    try {
        await connectToDB();

        // Fetch the current date and time from World Time API for Asia/Kolkata
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata', {
            headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch time from World Time API');
        }
        const timeData = await response.json();
        const localDate = timeData.datetime.split('T')[0]; // Extract the date in 'YYYY-MM-DD' format

        console.log('Current date (World Time API):', localDate);

        // Find the document with the current date
        let data = await Data.findOne({ date: localDate });

        if (!data) {
            // If no document exists for the current date, create a new one with a random 4-digit number for time4number
            const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
            const paddedNumber = random4DigitNumber.toString().padStart(4, '0');
            data = new Data({
                date: localDate,
                time4number: paddedNumber,
            });
            await data.save();
            return new Response(JSON.stringify({ timeNumber: paddedNumber }), {
                status: 200,
            });
        } else {
            if (data.time4number === null || data.time4number === 0) {
                // If time4number is null or 0, generate a random 4-digit number and update the document
                const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
                const paddedNumber = random4DigitNumber.toString().padStart(4, '0');
                data.time4number = paddedNumber;
                await data.save();
                return new Response(JSON.stringify({ timeNumber: paddedNumber }), {
                    status: 200,
                });
            } else {
                // If time4number is not null or 0, return the existing value as a 4-digit string
                const paddedNumber = data.time4number.toString().padStart(4, '0');
                return new Response(JSON.stringify({ timeNumber: paddedNumber }), {
                    status: 200,
                });
            }
        }
    } catch (error) {
        console.log(error.message);
        return new Response("Failed to fetch data", { status: 500 });
    }
}

export const POST = handler;
