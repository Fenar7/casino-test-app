"use server";
import { connectToDB } from '@/utils/database';
import Data from '@/models/datatable';

export default async function handler(req, res) {
    try {
        await connectToDB();

        // Get the current date and time from the server in Asia/Kolkata timezone
        const serverDate = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour12: false };
        
        const currentDate = serverDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // Format: YYYY-MM-DD
        const currentHour = parseInt(serverDate.toLocaleTimeString('en-GB', options).split(':')[0]); // Extract hour in 24-hour format

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
                } else if (currentHour >= 12 && currentHour < 15) {
                    return {
                        ...item.toObject(),
                        time2number: null,
                        time3number: null,
                        time4number: null,
                    };
                } else if (currentHour >= 15 && currentHour < 17) {
                    return {
                        ...item.toObject(),
                        time3number: null,
                        time4number: null,
                    };
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
