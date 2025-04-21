const { ConvexHttpClient, ConvexClient } = require("convex/browser");
const { api } = require("./convex/_generated/api_cjs.cjs");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" })
var XLSX = require("xlsx");

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
//client.query(api.questions.get,{status:"waiting"}).then(console.log);


const workbook = XLSX.readFile('./Sample Qs- Format for Script to Import Qs Ans.xlsx');

const sheetNames = workbook.SheetNames;
//console.log("Sheet Names:", sheetNames);

const sheet = workbook.Sheets[sheetNames[0]];

const jsonData = XLSX.utils.sheet_to_json(sheet); // ✅ Corrected here
//console.log("Parsed Data:", jsonData);

jsonData.forEach((row, index) => {
  console.log(`Row ${index + 1}:`, row)
});
