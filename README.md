create function for Topic,Question,Answer,Type. 

-- topic

function check(query,label){
    let topicId = query
    if(query == Id){
        return
    }else if (query === string){
        const topicId = await useQuery(api.topic.create)
      } 
    }
    return topicId
}

async function submit(){
    const topic = await check()

}

--create a admins.ts file inside convex. 
-- receive all of the form data there. 

-- create a async function like check which uses ctx.db obviously.

-- for topic (if string & not id), just create

-- for question (if string & not Id), create, get qId & then use it to add to Surah_Ques & TopicQues

-- for ans, create, getId. 

-- for type, if new, create. getAnsId & insert in Ans_



async function(formData){
    let topicId, questionId, answerId, typeId, surahId
    const topicId =await check(formData.topic, ctx, "topic")
    const questionId = await check(formData.question, ctx, "question")
//create question & add relation
    const surahques = await create(qId, formData.surah, Surah_Ques);
    const topicques = await create(qId,formData.topicId,Topic_Ques );

    const ansId = await create(formData.answer)
    const typeId = await check(formData.type)
//create answer relations now
    const ansType = await create(ansId, typeId, Ans_Types);
    const ansQues = await create(ansId,qId, Q_A);
    


    

}