require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/test-ai", async (req, res) => {
  const prompt = req.query?.prompt;

  if (!prompt) {
    res.send({ message: "Please provide prompt" });
    return;
  }

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  res.send({ message: result.response.text() });
});

app.get("/chat-conversation", async (req, res) => {
  const prompt = req.query?.prompt;

  if (!prompt) {
    res.send({ message: "Please provide a prompt in query" });
    return;
  }

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });
  const result = await chat.sendMessage(prompt);
  const answer = result.response.text();
  res.send({ rumorMessage: answer });
});

app.get("/generate-json", async (req, res) => {
  const prompt = req.query?.prompt;

  if (!prompt) {
    res.send({ message: "Please provide a prompt in query" });
    return;
  }

  const finalPrompt = `Generate some data from this prompt ${prompt} using this JSON schema:
    data = {'datatype': output}
    Return: Array<Recipe>`;

  const result = await model.generateContent(finalPrompt);
  const output = result.response.text().slice(7, -4);
  const finalOutput = JSON.parse(output);
  res.send(finalOutput);
});

app.get("/", (req, res) => {
  res.send({ messag: "Let's crack the ai ......" });
});
app.listen(port, () => {
  console.log("Server running on port ", port);
});
