import { client,connection, database } from "./database.js";
import fs from "fs";

console.log("CONNECTION:", process.env.CONNECTION);
async function uploadJSON() {
    try {
        await connection;
        await database.collection('bikeways').drop();
        const data = JSON.parse(fs.readFileSync("bikeways.json", "utf8"));
        const result = await database.collection('bikeways').insertMany(data);
        console.log("Uploaded", result.insertedCount);
        client.close();
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }


}

uploadJSON();