## 🫧 Prompt Purify: Prompt Cleaning & Structuring Tool

A lightweight web application that restructures rough or noisy user prompts into clean, structured prompts optimized for Large Language Models (LLMs) using Google Gemini.

Prompt Purify relies on a strict system instruction sent to the LLM to transform user input into clearly separated **TASK**, **CONSTRAINTS**, and **CONTEXT** sections.

---

## 🏁 Quick Start

### Installation

Install dependencies and start the development server:

    npm install
    npm run dev

### Basic Usage

1. Paste a raw or messy prompt into the **Original Prompt** field.
2. Optionally provide additional instructions or constraints.
3. Click **Clean Prompt**.
4. The application sends the input to Gemini and returns a structured, cleaned prompt.

The cleaned result is returned as structured text with XML-like tags and displayed alongside the original input.

---

## 🛠️ Development Environment

This project was developed using **AI Studio by Vibe Coding**. All testing and development were done within that environment.


---

## 💡 Core Features

* **LLM-Based Prompt Cleaning**  
  Uses Google Gemini with a strict system instruction to analyze user intent and restructure input into:
  - TASK
  - CONSTRAINTS
  - CONTEXT

* **Noise Reduction via Instruction Design**  
  Conversational filler such as greetings and politeness (for example: “please”, “hi”) is filtered by the model according to the system prompt.

* **Structured Output Format**  
  The model is instructed to return output using fixed section labels, making the result easy to reuse in downstream LLM workflows.

* **Diff View Visualization**  
  The UI highlights removed or altered words by comparing the original prompt with the cleaned output.

* **Copy-Ready Output**  
  Cleaned prompts can be copied in a structured, XML-like format for reuse with ChatGPT, Claude, or Gemini.

---

## ⚙️ Configuration (LLM Behavior)

Prompt cleaning behavior is controlled entirely by the **system instruction** defined in:

    services/geminiService.ts

You can customize:
- How intent is interpreted
- What content is considered noise
- How TASK, CONSTRAINTS, and CONTEXT are extracted
- Output formatting rules

There is currently **no local, rule-based sanitization or prompt-injection detection** implemented.

---

## 📚 Technical Deep Dive and Full Analysis

The design rationale and prompt-cleaning approach were explored in a Kaggle competition write-up.

Read the full Kaggle write-up here for more details :
https://www.kaggle.com/competitions/gemini-3/writeups/prompt-purify-1765362698142

---

## 🤝 Contributing

Contributions are welcome.

If you would like to:
- Improve the system instruction
- Enhance the UI or diff logic
- Add local, non-LLM sanitization layers

Please open an issue first to discuss the proposed changes.

---

## ⚖️ License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

