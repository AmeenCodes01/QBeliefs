const { ConvexHttpClient, ConvexClient } = require("convex/browser");
const { api } = require("./convex/_generated/api_cjs.cjs");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" })
var XLSX = require("xlsx");

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);


async function main() {


const   types = await client.query(api.types.get);
const surahs = await client.query(api.surahs.get)
   const topics = await client.query(api.topics.get)
   const workbook = XLSX.readFile('QuranicBelief Qs for Upload - 02May25 Batch 45 Qs for upload.xlsx');
   
   const sheetNames = workbook.SheetNames;
   //console.log("Sheet Names:", sheetNames);
   
   const sheet = workbook.Sheets[sheetNames[0]];
   const jsonData = XLSX.utils.sheet_to_json(sheet); // ✅ Corrected here
   
   let i = -1;
   let ques = [];
   let currentTitle = "";
 

jsonData.forEach((row) => {
  if (row.Question !== currentTitle) {
    i += 1;
    currentTitle = row.Question;

    const topicId = topics.filter(t=> t.topic === row.Categories.trim())[0]?._id
    ques[i] = {
      topic: {
        title: topicId? "": row.Categories,
        id: topicId ? topicId:"", // Will fill later
      },
      question: {
        title: row.Question || "",
        id: "", // Will fill later
        no: row["Q. No."]
      },
      answers: []
    };
  }

  // Match surah _id based on Sub-Category (Chapter No.)
  const matchedSurah = surahs.find(
    (s) => s.surah === JSON.stringify(row["Sub-Category (Chapter No.)"])
  );
  const surahId = matchedSurah ? matchedSurah._id : "";

  // Check if this s_id group already exists inside answers array
  let existingAnswerGroup = ques[i].answers.find(
    (a) => a.s_id === surahId
  );

  if (!existingAnswerGroup) {
    existingAnswerGroup = {
      id: "",         // Will fill later
      s_id: surahId,  // Grouping ID
      types: []
    };
    ques[i].answers.push(existingAnswerGroup);
  }

  // Match type _id based on Text Type
  const matchedType = types.find((t) => t.name === row["Text Type"]);
  const typeId = matchedType ? matchedType._id : "";

  // Add the typed answer to the correct answer group
  existingAnswerGroup.types.push({
    id: "", // Will fill later
    type: typeId,
    text: row["Answer Description"] || "",
    reference:""
   // reference: row["Reference"] || ""
  });
});

ques.forEach(async(ques,i)=>{
  // console.log(ques.question, " ques")
  // console.log(ques.answers, " ans")
  const result= await client.mutation(api.admin.create,{...ques});
  
  console.log(result)
})


}
 main(); 
// This marker makes the text render Right-to-Left
