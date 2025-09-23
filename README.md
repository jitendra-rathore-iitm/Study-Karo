
# 📚 Study Karo — Your AI-Powered Learning Companion

Welcome to **Study Karo**, an intelligent and interactive AI-driven learning platform designed to make studying smarter, not harder. Whether you're a student preparing for exams, a lifelong learner exploring new domains, or an educator building adaptive learning tools, Study Karo leverages state-of-the-art AI models to elevate your learning experience.

Built using **React**, **Flask**, **PostgreSQL**, **Docker**, and powered by cutting-edge AI APIs like **Gemini 2.5 Pro**, **Gemini 2.5 Flash**, and **Perplexity Pro**, this platform delivers fast, responsive, and highly personalized content—on demand.

Demo:- https://drive.google.com/file/d/1kvnRlbh46-fnRd5cEKSGccCBquh6D5mZ/view?usp=sharing
---

## 🚀 Features

- 🤖 **AI-Driven Q&A:** Ask questions and receive detailed, accurate responses instantly.
- 📈 **Smart Summarization:** Summarize long-form text, notes, or articles using powerful LLMs.
- 🧠 **Multimodal Understanding:** Supports image + text inputs for a richer interaction.
- 🎯 **Personalized Learning Paths:** AI curates study plans based on your goals and progress.
- 💬 **Live Chat Interface:** Natural, intuitive chat for human-like AI interaction.
- 🌐 **Modern Web App:** Beautifully built with React, JavaScript, CSS, and HTML.

---

## 🛠️ Tech Stack

| Frontend   | Backend   | Database     | Containerization | AI APIs Supported            |
|------------|-----------|--------------|------------------|------------------------------|
| React.js   | Flask     | PostgreSQL   | Docker + Compose | Gemini 2.5 Pro, Flash, Perplexity Pro |

---

## 📦 Installation & Setup Guide

Follow these steps to run Study Karo on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/jitendra-rathore-iitm/Study-Karo.git
```

### 2. Backend Setup

```bash
cd Study-Karo/backend
uv venv venv
uv pip install -r requirements.txt
```

In a **new terminal**, run:

```bash
cd Study-Karo/backend
docker compose up --build -d
```

Go back to the **first terminal**:

```bash
python run.py
```

### 3. Frontend Setup

In a new terminal:

```bash
cd Study-Karo/frontend
npm install
npm run dev
```

---





---

## 💡 Inspiration

The idea behind **Study Karo** was simple: students today are overwhelmed with information but lack the right tools to process, retain, and engage with it efficiently. What if you had an AI tutor available 24/7? What if it could adapt to *your* learning style, summarize complex topics, and even answer questions like a human professor?

**Study Karo is that tutor.**

---

## 🧠 AI Capabilities

We integrate with:

- **🔹 Gemini 2.5 Pro** — Advanced conversational and reasoning ability.
- **🔹 Gemini 2.5 Flash** — Lightning-fast responses for real-time interactions.
- **🔹 Perplexity Pro** — Web-connected, contextual, research-grade answers.
- etc......

These models empower Study Karo to deliver **deeply contextual**, **accurate**, and **multi-turn** conversations.

---

## 🏁 Future Vision

- 📚 Add subject-specific AI agents
- 🌐 Multilingual support
- 🎥 Voice + video tutoring powered by LLMs
- 🧩 Plugin-based extensibility for teachers and devs

---



## 📜 License

MIT License. See `LICENSE` for more information.

---





