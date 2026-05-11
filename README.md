# poll_it_out

A modern polling application built with TypeScript.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Workflow & Logic](#workflow--logic)

---

## Overview

**poll_it_out** is a web-based platform that enables users to create, manage, and participate in polls easily. The project is primarily written in TypeScript, ensuring type safety and maintainability. It seamlessly blends modern web technologies for a smooth user experience.

## Features

- Create new polls with multiple options
- Vote on active polls
- Real-time result updates
- Responsive UI
- Simple and intuitive user flow

## Tech Stack

- **TypeScript** (97%)
- **CSS** (2.8%)
- **JavaScript** (0.2%)

## Project Structure

```
/src
  /components
  /pages
  /services
  /utils
  index.tsx
/public
/...
README.md
package.json
tsconfig.json
```

- **components/**: Reusable UI elements (e.g., PollForm, PollList, PollResult)
- **pages/**: Top-level pages/views (e.g., Home, CreatePoll)
- **services/**: Business logic such as API requests and poll state management
- **utils/**: Helper utilities and custom hooks

## Installation

```bash
git clone https://github.com/shubhisme/poll_it_out.git
cd poll_it_out
npm install
```

## Usage

To run the app locally:

```bash
npm start
# or
yarn start
```

To build for production:

```bash
npm run build
```

## Workflow & Logic

### 1. Creating a Poll

- The user navigates to the **Create Poll** page.
- A form allows the user to:
  - Enter a poll question.
  - Add, remove, and specify poll options.
- Upon submission, the data is validated (ensuring at least two options, etc.).
- The poll is then saved (locally or via a backend API).

### 2. Listing and Voting

- The home page displays active polls fetched from a data source.
- Each poll component displays:
  - The poll question
  - Voting options as selectable buttons or radio inputs.
- Users can select an option and submit their vote.
- Duplicate voting is prevented using either local storage, user IDs, or backend checks.

### 3. Fetching & Displaying Results

- After voting, the results are dynamically updated and shown as progress bars or charts.
- The percentages for each option are calculated in real time.
- Voting statistics are updated in the backend or global state for consistency.

### 4. State Management

- State is managed using modern React hooks (e.g., `useState`, `useContext`, or `redux` if scale requires).
- Asynchronous actions (such as fetching polls or submitting a vote) use async/await and handle loading and error states.

### 5. UI/UX Workflow

- The UI is responsive and accessible.
- CSS handles consistent styling for all components.
- Error, loading, and empty states are clearly communicated to the user.

### 6. Business Logic Example (TypeScript)

```typescript
// Pseudo logic for voting
async function voteOnPoll(pollId: string, optionId: string, userId: string) {
  // Check if user has already voted
  const hasVoted = await checkUserVote(pollId, userId);
  if (hasVoted) {
    throw new Error("User has already voted on this poll.");
  }
  // Submit the vote
  await submitVote(pollId, optionId, userId);
  // Fetch updated results
  const updatedResults = await getPollResults(pollId);
  return updatedResults;
}
```

# Real-time Communication with Socket Server

To provide instant feedback and a dynamic experience, **poll_it_out** integrates with a remote Socket.IO server:

```txt
https://socket-server-xtgs.onrender.com
```

---

## How It Works

- The frontend establishes a WebSocket connection using Socket.IO.
- When a user submits a vote, the client emits a `vote` event to the socket server.
- The socket server processes the event and broadcasts updated poll results to all connected clients subscribed to that poll.
- All users viewing the same poll receive live updates instantly without refreshing the page.

---

## Socket.IO Integration Example

```ts
import { io } from "socket.io-client";

// Connect to the socket server
const socket = io("https://socket-server-xtgs.onrender.com");

// Join a poll room
socket.emit("join_poll", pollId);

// Listen for real-time result updates
socket.on("poll_updated", (data) => {
  // Update local poll state with new results
  updatePollResults(data);
});

// Emit a vote event
function submitVote(pollId, optionId, userId) {
  socket.emit("vote", {
    pollId,
    optionId,
    userId,
  });
}
```

---

## Real-time User Flow

1. User submits a vote.
2. Client emits a `vote` event to the socket server.
3. Server processes the vote and broadcasts updated poll results.
4. All connected users in the same poll room receive the update.
5. Frontend updates instantly with live poll statistics.

---

## Benefits

- ⚡ Instant poll updates without page refresh
- 🌐 Real-time synchronization across connected users
- 📊 Interactive and dynamic polling experience
- 🚀 Scalable architecture for handling multiple users simultaneously
- 🔄 Seamless live communication using WebSockets and Socket.IO
