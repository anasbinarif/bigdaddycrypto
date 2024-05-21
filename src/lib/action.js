// "use server";
//
// import { promises as fs } from 'fs';
// import {Assets} from "../lib/models";
//
// const BATCH_SIZE = 50;
//
// export const importAssetsRisk = async () => {
//     try {
//         console.log("starting.............");
//         const dataBuffer = await fs.readFile(
//             "C:/Users/anasb/OneDrive/Desktop/upwork/bigdaddycrypto/src/v1_sql/Assets.json"
//         );
//         const dataString = dataBuffer.toString();
//         const jsonData = JSON.parse(dataString);
//         console.log("jsonData length:", jsonData[2].data.length);
//
//         let index = 0;
//         while (index < jsonData[2].data.length) {
//             const batchData = jsonData[2].data
//                 .slice(index, index + BATCH_SIZE)
//                 .map((item) => ({
//                     ID: item.ID,
//                     Risk: item.Risk || "",
//                 }));
//
//             for (const asset of batchData) {
//                 await Assets.updateOne(
//                     { ID: asset.ID },
//                     { $set: { Risk: asset.Risk } },
//                     { upsert: true }
//                 );
//             }
//
//             console.log(`Batch ${index / BATCH_SIZE + 1} imported successfully`);
//             index += BATCH_SIZE;
//         }
//
//         console.log("Data import complete.");
//     } catch (e) {
//         console.log("Error importing data:", e);
//         throw e;
//     }
// };
//
