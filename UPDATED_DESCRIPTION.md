# AI Study Buddy --- Updated Project Specification (Refactored to New Architecture)

## Overview

This document restructures the original project description to align
with the new architecture we discussed:\
**Tutor Chats → Study Sessions → Global Library → Practice**,\
with a clean sidebar hierarchy and unified material flow.

------------------------------------------------------------------------

# 1. Core System Architecture

## 1.1 Top-Level Navigation (Sidebar)

    Home

    Tutor Chats
     ├─ Math Chat
     ├─ Physics Chat
     └─ Python Chat

    Study Sessions
     ├─ Python Basics
     ├─ Linear Algebra
     └─ English Vocabulary Boost

    Library
     ├─ Files
     ├─ Notes
     ├─ Quizzes
     ├─ Flashcards
     └─ Code Labs

This structure eliminates duplication and separates: - **Chats
(free-form Q&A + local materials)** - **Study Sessions (structured
courses)** - **Library (all materials in one place)**

------------------------------------------------------------------------

# 2. Functional Modules (Refactored)

## 2.1 Tutor Chats Module

Each tutor chat is an AI-driven conversational workspace.

### Features:

-   Ask questions about any topic\
-   Attach files for context\
-   Generate:
    -   Explanations\
    -   Quizzes\
    -   Flashcards\
    -   Code tasks\
-   Materials created **inside a chat** are shown under:
    -   Chat Materials\
    -   Chat Quizzes\
    -   Chat Flashcards\
    -   Chat Code Labs

All materials are also stored globally in **Library**.

------------------------------------------------------------------------

## 2.2 Study Sessions Module (AI-generated mini-courses)

A Study Session creates a structured learning path based on: -
User-provided topic\
- Uploaded materials\
- Existing Library items

### Session Structure:

-   Lessons (with explanations)
-   Embedded quizzes
-   Flashcards
-   Code tasks/labs
-   Progress tracking

### Features:

-   AI course generation\
-   Adaptive difficulty\
-   Lesson sequencing\
-   Session analytics\
-   Save & resume sessions

------------------------------------------------------------------------

## 2.3 Library Module (Global Material Storage)

The *Library* stores everything generated across the system.

### Sections:

-   **Files** (uploaded PDFs, notes, docs)
-   **Notes** (AI explanations, summaries)
-   **Quizzes**
-   **Flashcard decks**
-   **Code Labs**
-   **Lessons** (from Study Sessions)

### Features:

-   Searching & filtering\
-   Tags & metadata\
-   Export (CSV, Anki, plain text)\
-   Storage limits (Free vs Pro)

------------------------------------------------------------------------

## 2.4 Practice Module (Optional)

A global practice environment for: - Random quizzes\
- Flashcard study\
- Adaptive drills\
- Spaced repetition

Helps retain knowledge independent of chat/session context.

------------------------------------------------------------------------

# 3. Enhanced Modules from Original Spec (Repositioned)

## 3.1 Quiz Module

**Integrated into:** - Tutor Chats (local quizzes) - Study Sessions
(lesson quizzes) - Library (all quizzes)

### Features:

-   Multiple question types
-   Difficulty selection
-   Timer mode
-   Analytics
-   Re-attempting quizzes
-   Study Session linking

------------------------------------------------------------------------

## 3.2 Flashcard Module

**Integrated into:** - Chats\
- Study Sessions\
- Library

### Features:

-   Auto-generation\
-   Spaced repetition (SM-2)\
-   Mastery tracking\
-   Export options

------------------------------------------------------------------------

## 3.3 AI Explainer Module

Works everywhere: - Chats\
- Study Sessions\
- File-based questions\
- Library notes

Supports: - ELI5\
- Academic\
- Step-by-step\
- Analogies

------------------------------------------------------------------------

## 3.4 Code Lab Module

A new unified version of "labs":

Appears in: - Chat (AI generates tasks as needed) - Study Session
(programming labs inside lessons) - Library (all stored labs)

Supports: - Running code\
- Submit + AI grading\
- Hints + debugging help

------------------------------------------------------------------------

# 4. User & Subscription System (Refactored)

## Free Tier

-   3 uploads/week\
-   500MB storage\
-   Unlimited chats\
-   Unlimited explanations\
-   Basic quizzes & flashcards\
-   Basic study sessions (short form)

## Pro Tier

-   Unlimited uploads\
-   5GB storage\
-   Full Study Sessions\
-   Advanced analytics\
-   Exam simulator\
-   Study Plans\
-   Study Groups\
-   Export features\
-   Priority AI

------------------------------------------------------------------------

# 5. Analytics (Updated)

Analytics now cover: - Chat usage\
- Study Session progress\
- Library activity\
- Practice performance\
- Topic weaknesses\
- Time spent learning

------------------------------------------------------------------------

# 6. Technical Architecture (Updated Around New Structure)

-   **Frontend:** Next.js, Zustand, shadcn/ui, Recharts\
-   **Backend:** NestJS/Next.js API, Prisma, Redis\
-   **AI:** Gemini, custom chunking, structured outputs\
-   **Database:** PostgreSQL\
-   **Storage:** Supabase/Vercel Blob\
-   **Auth:** NextAuth\
-   **Payments:** Stripe\
-   **Hosting:** Vercel

------------------------------------------------------------------------

# 7. Database Schema (Cleaned & Re-Aligned)

## Main Entities:

-   **User**
-   **Chat**
-   **ChatMessage**
-   **StudySession**
-   **Lesson**
-   **Material** (abstract → File, Quiz, Flashcard, CodeTask, Note)
-   **QuizResult**
-   **FlashcardReview**
-   **Subscription**

Relationships ensure: - Materials created anywhere appear in the global
Library\
- Study Sessions reference Library content\
- Chats keep "local references", not separate entities

------------------------------------------------------------------------

# 8. Updated Roadmap (Matching New Architecture)

### Phase 1 --- Core Foundation

-   Auth\
-   File upload\
-   Global Library\
-   Basic AI explanation

### Phase 2 --- Chats

-   Chat UI\
-   File/context handling\
-   Generate materials

### Phase 3 --- Materials System

-   Quizzes\
-   Flashcards\
-   Code Labs

### Phase 4 --- Study Sessions

-   AI course generator\
-   Lesson pages\
-   Progress tracking

### Phase 5 --- Analytics & Plans

-   Learning insights\
-   Study plans\
-   Upgrade system

### Phase 6 --- Premium Tier

-   Stripe, groups, export\
-   Mobile app

------------------------------------------------------------------------

# 9. Value Proposition (Refined)

Compared to: - **GPT:** persistent, structured, all-in-one\
- **Quizlet:** quizzes + SRS + full pipeline\
- **Notion:** purpose-built for learning\
- **Brilliant:** adaptive courses + generative content

Your platform becomes: **A unified AI-driven learning environment.**

------------------------------------------------------------------------

# 10. Final Notes

This refactor:\
- Removes redundancy\
- Introduces clean navigation\
- Aligns all modules under a single material system\
- Supports scaling into a full EdTech platform
