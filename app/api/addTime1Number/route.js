"use server";

import { connectToDB } from '@/utils/database';
import Data from '@/models/datatable';

export default async function handler(req, res) {
    try {
        const { time1number, time2number, time3number, time4number } = await req.json();

        let time1numberNumber = null;
        let time2numberNumber = null;
        let time3numberNumber = null;
        let time4numberNumber = null;

        if (time1number !== '') {
            time1numberNumber = parseInt(time1number, 10);
        }
        if (time2number !== '') {
            time2numberNumber = parseInt(time2number, 10);
        }
        if (time3number !== '') {
            time3numberNumber = parseInt(time3number, 10);
        }
        if (time4number !== '') {
            time4numberNumber = parseInt(time4number, 10);
        }

        console.log(time1numberNumber, time2numberNumber, time3numberNumber, time4numberNumber);

        await connectToDB();

        // Fetching the current date and time from World Time API for Asia/Kolkata
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata', {
            headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch time from World Time API');
        }
        const timeData = await response.json();
        const localDate = timeData.datetime.split('T')[0]; // Extract the date in 'YYYY-MM-DD' format

        console.log('current date (World Time API):', localDate);

        const updateData = {
            time1number: time1numberNumber,
            time2number: time2numberNumber,
            time3number: time3numberNumber,
            time4number: time4numberNumber,
        };

        const oldData = await Data.findOne({ date: localDate });

        console.log("Old Data:", oldData);
        if (oldData) {
            await Data.findOneAndUpdate(
                { date: localDate },
                { $set: updateData },
                { new: true, upsert: true } // Create a new document if one doesn't exist
            );
            console.log('Data updated');
        } else {
            const data = new Data({
                date: localDate, // Save the current date
                time1number: time1numberNumber,
                time2number: time2numberNumber,
                time3number: time3numberNumber,
                time4number: time4numberNumber,
            });
            await data.save();

            console.log('Data inserted');
        }

        return new Response("Success", { status: 201 });
    } catch (error) {
        console.log(error.message);
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}

export const POST = handler;
