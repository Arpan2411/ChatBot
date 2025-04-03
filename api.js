import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from "body-parser";
import axios from "axios";
import express from "express";
import OpenAI from 'openai';
import cors from "cors";

//basic server code starts
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;

app.use(cors({
  origin: 'http://127.0.0.1:5500', // No trailing slash
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.urlencoded({ extended: true })); // For URL-encoded bodies
//basic server code ends

//All gen ai functions start
async function geminiFunc(question, words){
  const genAI = new GoogleGenerativeAI("AIzaSyAj5wAy4UFkxjDWfo8-zgbPcqkMtJ8NBrw");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  let prompt = `${question}. Give only plain text, do not give in markdown or any other language.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function deepseekFunc(question, words){
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: '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',
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-zero:free',
      messages: [
        {
          role: 'user',
          content: `${question}. Give only plain text, do not give in markdown or any other language.`,
        },
      ],
    });
    console.log(completion.choices[0].message.content);
    return (completion.choices[0].message.content);
  }
  return main();
}

async function llamaFunc(question, words){
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
  });
  async function main() {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
          "role": "user",
          "content": `${question}. Give only plain text, do not give in markdown or any other language.`
        }
      ],
      
    });
    return(completion.choices[0].message.content);
  }
  
  return main();
}
//all gen ai functions end

//Counting words function starts
function countWords(ans){
  let currIsWord = false;
  let length = ans.length;
  let words = 0;
  for(let i = 0; i < length; i ++){
    if(! currIsWord && ans[i] != ' '){
      words ++;
      currIsWord = true;
    }
    else if(currIsWord && ans[i] == ' '){
      currIsWord = false;
    }
  }
  return words;
}

//counting words function ends

//get route for custom api starts

app.post("/", async (req, res) => {
  const isGemini = Number(req.body.gemini);
  const isDeepSeek = Number(req.body.deepseek);
  const isLlama = Number(req.body.llama);
  const words = Number(req.body.words);
  const question = req.body.prompt;

  let ans = ' ';
  let numberOfWords = 0;

  if(isGemini){
    ans =  await geminiFunc(question, words);
  }
  else if(isDeepSeek){
    ans = await deepseekFunc(question, words);
  }
  else if(isLlama){
    ans = await llamaFunc(question, words);
  }
  numberOfWords = countWords(ans);

  let r = {
    response: ans,
    wordCount: numberOfWords
  };
  console.log(ans);
  res.json(r);
});

//get route for custom api ends


//port listener code starts

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

//port listener code ends








//Just for testing
//let geminiAns = "aa";
/*let question = `do you deepseek?`;
let words = 100;
let geminiAns = await llamaFunc(question, words);
//let gemini = geminiAns.length;

console.log(geminiAns);*/
//console.log(gemini);

//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


//Gemini code starts
/*const genAI = new GoogleGenerativeAI("AIzaSyB4kFPhiNTPNnioQNxsxg5AwLkcx_CkaEE");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = "Explain how AI works";

const result = await model.generateContent(prompt);
console.log(result.response.text().length);*/

//Gemini code ends

//OpenAI/DeepSeek code

/*
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'deepseek/deepseek-r1-zero:free',
    messages: [
      {
        role: 'user',
        content: 'Output in emglish language only \n' + 'History of India',
      },
    ],
  });

  console.log(completion.choices[0].message);
}
main();
*/


// LLAMA code
// "Chatbot01 api_key" : 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


//import OpenAI from 'openai';
/*const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});
async function main() {
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-70b-instruct:free",
    messages: [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    
  });

  console.log(completion.choices[0].message);
}

main();*/

//ends
