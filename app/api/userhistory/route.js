"use server";
import { connectToDB } from '@/utils/database';
import Data from '@/models/datatable';

export default async function handler(req, res) {
    try {
        await connectToDB();

        // Fetch the current date and time from World Time API for Asia/Kolkata
        const timeResponse = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata', {
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (!timeResponse.ok) {
            throw new Error('Failed to fetch time from World Time API');
        }

        const timeData = await timeResponse.json();
        console.log('Time Data from API:', JSON.stringify(timeData));
        
        // Use the datetime field directly
        const datetimeString = timeData.datetime; // e.g., "2024-08-03T15:03:48.812718+05:30"
        const currentDate = datetimeString.split('T')[0]; // Format: YYYY-MM-DD
        const currentHour = parseInt(datetimeString.split('T')[1].split(':')[0]); // Extract hour

        console.log(`Current date (IST): ${currentDate}`);
        console.log(`Current hour (IST): ${currentHour}`);

        // Fetch all data, sorted by date in descending order
        const data = await Data.find().sort({ date: -1 });

        // Map over the data and apply the logic to the current date
        const modifiedData = data.map((item) => {
            const itemDate = new Date(item.date).toISOString().split('T')[0]; // Format: YYYY-MM-DD

            if (itemDate === currentDate) {
                if (currentHour < 12) {
                    return {
                        ...item.toObject(),
                        time1number: null,
                        time2number: null,
                        time3number: null,
                        time4number: null,
                    };
                } else if (currentHour >= 12 && currentHour < 14) {
                    return {
                        ...item.toObject(),
                        time2number: null,
                        time3number: null,
                        time4number: null,
                    };
                }else if(currentHour >= 14 && currentHour < 17){
                    return{
                        ...item.toObject(),
                        time3number: null,
                        time4number: null,
                    }
                } else if (currentHour >= 17 && currentHour < 19) {
                    return {
                        ...item.toObject(),
                        time4number: null,
                    };
                } else if (currentHour >= 19) {
                    return {
                        ...item.toObject(),
                    };
                }
            }

            return item;
        });

        return new Response(JSON.stringify(modifiedData), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch user history data", {
            status: 500,
        });
    }
}

export const POST = handler;
