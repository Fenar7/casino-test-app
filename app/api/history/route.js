// /pages/api/getHistory.js
"use server";
import { connectToDB } from '@/utils/database';
import Data from '@/models/datatable';

export default async function handler(req, res) {
    try {
        await connectToDB();
        const data = await Data.find().sort({ date: -1 }); // Fetch all data, sorted by date in descending order
        return new Response(JSON.stringify(data),{
            status: 200,
        })
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch history data",{
            status:200,
        })
    }
}

export const POST = handler;
