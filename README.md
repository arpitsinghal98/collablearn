
# CollabLearn: A Community-Powered Learning Platform

**CollabLearn** is a collaborative learning platform that integrates the features of Discord and ChatGPT. The platform enables users to create or join learning groups for various topics, supported by AI-driven assistance, real-time discussions, resource sharing, and more.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation Instructions](#installation-instructions)
- [Usage](#usage)
- [Contributions](#contributions)
- [Impact on Resume](#impact-on-resume)

## Project Overview

CollabLearn is designed to enable users to collaborate effectively on learning goals. It integrates AI to enhance the learning process by offering summarizations, personalized recommendations, and quizzes based on ongoing discussions. With real-time chat, voice, and video features, CollabLearn offers a complete learning experience with the following features:

- **AI-Powered Assistance**: Summarizes discussions, generates quizzes, and suggests resources.
- **Real-Time Collaboration**: Group chat, voice/video discussions, and collaborative note-taking.
- **Resource Sharing**: Share articles, books, and other resources with automated organization.
- **Gamification**: Badges, points, and leaderboards to motivate users.
- **Multimodal Interaction**: Support for text, voice, and video communication.
  
## Features

### 1. AI-Powered Discussion Support
- Integrated **OpenAI’s ChatGPT** to provide real-time assistance during group discussions.
- Automatically summarizes conversations, answers user queries, and generates quizzes from discussions.
  
### 2. Group Collaboration Tools
- **Real-time Group Chat**: Users can engage in group discussions with support for markdown-based messages.
- **Collaborative Notes**: Share and edit notes in real time within the platform.

### 3. Gamification & Engagement
- **Badges**: Earn points for participation, quiz completion, and collaboration.
- **Leaderboards**: Display top contributors and encourage competition in learning.

### 4. Resource Sharing & AI Curation
- Share resources like articles, videos, and papers.
- AI organizes and tags shared resources for easy search and reference.

### 5. Voice and Video Interaction
- Integrated **Twilio** or **Agora.io** for voice and video capabilities in each group.

### 6. Notifications and Real-Time Updates
- Real-time notifications using **Socket.IO** to keep users updated on group activities, new content, and AI-generated recommendations.

## Technologies Used

- **Frontend**: 
  - **Next.js** (with TypeScript) – for dynamic, SEO-friendly frontend.
  - **TailwindCSS** – for responsive, modern UI design.
  - **NextAuth.js** – for secure user authentication.

- **Backend**:
  - **FastAPI (Python)** – for AI services and handling data.
  - **GraphQL (Apollo Server)** – for querying group data efficiently.
  - **Redis** – for real-time chat and caching.

- **AI Integration**:
  - **OpenAI API** (ChatGPT) – for conversational AI support.

- **Real-Time Features**:
  - **Socket.IO** – for real-time chat and notifications.

- **Database**:
  - **PostgreSQL** – for relational data (users, groups, and resources).
  - **MongoDB** or **Firebase** – for chat/message storage.

- **DevOps**:
  - **GitHub Actions** – for continuous integration and deployment (CI/CD).

- **Other Tools**:
  - **Twilio** or **Agora.io** – for real-time voice and video integration.
  - **AWS S3** – for file storage and media uploads.

## Project Structure

```bash
collablearn/
│
├── client/              # Frontend (Next.js app)
│   ├── components/      # React components
│   ├── pages/           # Next.js pages
│   ├── public/          # Static files
│   └── styles/          # TailwindCSS setup
│
├── server/              # Backend (FastAPI app)
│   ├── api/             # GraphQL API
│   ├── ai/              # AI (ChatGPT) integration
│   └── models/          # Database models
│
└── README.md            # Project documentation
```

## Installation Instructions

### Prerequisites:
- Node.js (for the frontend)
- Python 3.8+ (for the backend)
- PostgreSQL (or any other relational database of your choice)

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/collablearn.git
cd collablearn
```

### 2. Setup the Backend:
- Navigate to the `server` directory and install the required dependencies:
```bash
cd server
pip install -r requirements.txt
```

### 3. Setup the Frontend:
- Navigate to the `client` directory and install the required dependencies:
```bash
cd client
npm install
```

### 4. Running Locally:
- Access the platform at `http://localhost:3000`.

## Usage

1. **Create an Account**: Register via email or OAuth.
2. **Create/Join a Learning Group**: Search for existing groups or create a new one.
3. **Collaborate**: Start chatting, sharing resources, and collaborating with group members.
4. **Ask AI for Assistance**: Use ChatGPT to ask questions and get suggestions.
5. **Earn Rewards**: Participate and earn badges for contributions.

## Contributions

Feel free to contribute! To get started:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Impact on Resume

### Key Skills:
- **AI Integration**: Implemented AI-powered features using OpenAI API to assist users in real-time discussions.
- **Real-Time Development**: Built real-time messaging and notifications with **Socket.IO** and **Redis**.
- **Full-Stack Development**: Developed a complete solution using **Next.js** for the frontend and **FastAPI** for backend services.
- **DevOps & Deployment**: Utilized **GitHub Actions** for CI/CD pipelines.
- **Cloud Integration**: Used **AWS S3** for file management and **Twilio/Agora.io** for communication features.