# AI Study Buddy - Project Specification

## Project Overview
An AI-powered study assistant that helps students learn more effectively by generating quizzes, flashcards, and explanations from their study materials.

---

## Core Features

### 1. Document Management Module
**Functionality:**
- Upload documents (PDF, TXT, DOCX, MD)
- Extract and process text content
- Store documents in user's library
- Display storage usage stats
- Manage document organization (folders, tags)
- Delete documents and reclaim storage

**Free Tier Limits:**
- 3 document uploads per week
- 500MB total storage
- Keep documents forever within limit

**Pro Tier Benefits:**
- Unlimited uploads
- 5GB storage
- Bulk upload (10 files at once)
- Priority processing

---

### 2. Quiz Generation Module
**Functionality:**
- Generate quizzes from uploaded documents
- Multiple quiz types: multiple-choice, true/false, short-answer, essay
- Adjustable difficulty levels: easy, medium, hard
- Customizable question count (5-50)
- Instant feedback with explanations
- Quiz history tracking
- Score tracking and analytics
- Timed quiz mode
- Custom quiz builder (target specific topics/sections)

**Free Tier Access:**
- Unlimited quiz generation
- Basic types only (multiple-choice, true/false)
- Up to 20 questions per quiz

**Pro Tier Benefits:**
- Advanced types (short-answer, essay with AI grading)
- Up to 50 questions per quiz
- Custom quiz builder
- Exam simulator mode
- Question bank export

---

### 3. Flashcard Module
**Functionality:**
- Auto-generate flashcards from documents
- Create custom flashcards manually
- Review flashcards with spaced repetition (SM-2 algorithm)
- Track review progress
- Due flashcards notification system
- Flashcard statistics (mastery level, review count)
- Export to Anki format, CSV

**Free Tier Access:**
- Unlimited flashcard generation
- Unlimited review sessions
- Basic spaced repetition

**Pro Tier Benefits:**
- Bulk generation (up to 100 at once)
- Advanced spaced repetition analytics
- Export functionality
- Predictive review scheduling

---

### 4. AI Explainer Module
**Functionality:**
- Ask questions about uploaded documents
- Multiple explanation styles:
    - ELI5 (Explain Like I'm 5)
    - Technical/Academic
    - Step-by-step breakdown
    - Analogy-based
- Context-aware responses based on document content
- Follow-up question support
- Explanation history

**Free Tier Access:**
- Unlimited explanations
- All explanation styles
- Basic Q&A format

**Pro Tier Benefits:**
- AI Tutor mode (conversational with memory)
- Multi-document context queries
- Explanation export and sharing

---

### 5. Study Sessions Module
**Functionality:**
- Track study time per document
- Log activities (quizzes taken, flashcards reviewed)
- Session timer with pause/resume
- Daily/weekly study goals
- Study streak tracking
- Session history and insights

**Free Tier Access:**
- Basic session tracking
- Simple timer
- Activity logging

**Pro Tier Benefits:**
- Advanced session analytics
- Study pattern insights
- Productivity recommendations
- Focus time analysis

---

### 6. Analytics Module (Pro Only)
**Functionality:**
- Progress tracking over time
- Performance trends visualization
- Weak topic identification
- Learning velocity metrics
- Quiz score analysis
- Flashcard mastery tracking
- Exam readiness prediction
- Study time heatmaps
- Comparative performance (vs. previous weeks/months)

**Features:**
- Interactive charts and graphs
- Custom date range selection
- Export analytics reports
- AI-powered insights and recommendations

---

### 7. Study Plans Module (Pro Only)
**Functionality:**
- AI-generated personalized study schedules
- Input: exam date, available hours/day, documents to cover
- Day-by-day breakdown with tasks
- Adaptive planning (adjusts based on progress)
- Calendar integration
- Task completion tracking
- Reminder notifications

**Features:**
- Multiple study plans for different exams
- Plan templates (midterm, final, certification)
- Progress tracking against plan
- Plan sharing with study groups

---

### 8. Study Groups Module (Pro Only)
**Functionality:**
- Create and join study groups
- Share flashcard decks with group members
- Collaborative document libraries
- Group leaderboards
- Shared quiz challenges
- Group chat/discussion
- Member progress visibility
- Group analytics

**Features:**
- Public and private groups
- Invitation system
- Role management (admin, member)
- Activity feed

---

### 9. User Profile & Settings Module
**Functionality:**
- Profile management (name, email, avatar)
- Password change
- Account deletion
- Notification preferences
- Study preferences (default quiz settings, review frequency)
- Theme selection (dark mode)
- Language preferences

---

### 10. Subscription Management Module
**Functionality:**
- View current plan and features
- Upgrade/downgrade subscription
- Payment method management
- Billing history
- Usage statistics vs. limits
- Cancel subscription
- Reactivate subscription
- Student verification (.edu email)

**Stripe Integration:**
- Secure checkout flow
- Webhook handling for events
- Proration on plan changes
- Automatic renewal management

---

## Tech Stack Summary

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zustand (client state)
- React Hook Form + Zod
- Recharts (analytics)

### Backend
- tRPC (type-safe API)
- Zod validation
- Next.js API routes
- Prisma ORM

### AI & Processing
- Google Gemini API
- pdf-parse (PDF extraction)
- mammoth (DOCX extraction)
- Custom text chunking

### Database
- PostgreSQL (via Supabase recommended)
- Prisma for ORM
- Alternative: PlanetScale MySQL or MongoDB Atlas

### Authentication
- NextAuth.js v5
- Email/password + Google OAuth
- JWT sessions

### Storage
- Vercel Blob or Supabase Storage
- File upload via uploadthing or react-dropzone

### Payments
- Stripe (future phase)
- Stripe Checkout
- Webhook handlers

### Hosting
- Vercel (all-in-one)
- Free tier sufficient for MVP
- Auto-scaling

---

## Database Schema Overview

### Core Tables

**users**
- Basic user info (id, email, name, password)
- Subscription details (tier, status, Stripe IDs)
- Storage tracking (used MB, quota MB)
- Upload limits (weekly count, reset date)
- Feature flags (based on tier)

**documents**
- Document metadata (title, type, size)
- Content (extracted text)
- File URL (cloud storage link)
- User relationship
- Timestamps

**quizzes**
- Quiz metadata (difficulty, type)
- Questions (JSON array)
- Document relationship
- User relationship
- Timestamps

**quiz_results**
- Score and total questions
- Time taken
- Answer details (JSON)
- Quiz and user relationships
- Completion timestamp

**flashcards**
- Front and back content
- Spaced repetition data (ease factor, interval, next review)
- Document and user relationships
- Review statistics

**study_sessions**
- Duration
- Activities (JSON array)
- Document and user relationships
- Start and end timestamps

**study_plans** (Pro only)
- Plan metadata (exam date, daily hours)
- Schedule (JSON array of daily tasks)
- Progress tracking
- User relationship

**groups** (Pro only)
- Group metadata (name, description)
- Member list
- Shared resources
- Activity logs

**subscriptions**
- Stripe subscription data
- Payment history
- Plan change logs
- User relationship

---

## Freemium Strategy

### Free Tier Philosophy
Make the product genuinely useful so users get hooked on the workflow and convenience, not just AI access. Free tier should let users study effectively for 2-3 subjects per week.

### Conversion Triggers
Users upgrade when they:
1. Hit weekly upload limit during exam prep (urgent need)
2. Want to organize 10+ documents for semester-long studying
3. Need analytics to identify weak topics
4. Want to collaborate with classmates
5. Need advanced study planning features

### Upgrade Prompts (Non-Intrusive)
Show contextual upgrade suggestions:
- "You've uploaded 3/3 documents this week. Upgrade for unlimited uploads."
- "Pro users get detailed analytics showing exactly which topics need more focus."
- "Want to study with friends? Create study groups with Pro."

Display as subtle cards/banners in relevant areas, not as popups.

---

## Pricing Model

### Free Tier - $0
- 3 uploads/week, 500MB storage
- Unlimited quizzes (basic types)
- Unlimited flashcards
- Unlimited explanations
- Basic analytics
- Spaced repetition

### Pro Tier - $9.99/month or $8.99/month (annual)
- Unlimited uploads, 5GB storage
- All quiz types
- Bulk operations
- Advanced analytics
- Study plans
- Study groups
- Export features
- Priority processing
- AI tutor mode

### Student Tier - $4.99/month
- Same as Pro
- Requires .edu email verification
- 50% discount

### Team Tier - $49.99/month (10 users)
- All Pro features per user
- Shared libraries
- Admin dashboard
- Usage analytics
- For study groups or small classes

---

## MVP Development Phases

### Phase 1 (Weeks 1-2): Core Foundation
- User authentication (email/password)
- Document upload and storage
- Text extraction (PDF, TXT)
- Basic database schema
- User dashboard skeleton

### Phase 2 (Weeks 3-4): AI Features
- Gemini API integration
- Quiz generation (multiple-choice)
- Flashcard generation
- Basic explanation feature
- Quiz taking interface

### Phase 3 (Weeks 5-6): Core Experience
- Quiz results and scoring
- Flashcard review interface
- Spaced repetition (SM-2)
- Study session tracking
- Basic analytics dashboard

### Phase 4 (Weeks 7-8): Polish & Limits
- Storage tracking and limits
- Weekly upload limiting
- Document management improvements
- UI/UX refinements
- Mobile responsiveness

### Phase 5 (Future): Premium Features
- Stripe integration
- Advanced analytics
- Study plans generator
- Study groups
- Advanced quiz types
- Export functionality
- Browser extension

---

## Key Value Propositions

### vs. Raw Gemini
- **Organized workflow**: Upload once, generate unlimited materials
- **Persistent knowledge**: All documents and progress saved
- **Smart systems**: Spaced repetition, analytics, study plans
- **Collaboration**: Study groups, sharing
- **Tracking**: Progress over time, weak topics
- **Convenience**: Everything in one place

### vs. Manual Studying
- **Time-saving**: Auto-generate quizzes and flashcards in seconds
- **Personalized**: AI adapts to your documents and learning style
- **Effective**: Spaced repetition for optimal retention
- **Insightful**: Know exactly what you need to focus on
- **Structured**: Study plans keep you on track

---

## Success Metrics

### User Engagement
- Daily/monthly active users
- Average session duration
- Documents uploaded per user
- Quizzes generated per user
- Flashcards reviewed per user

### Conversion
- Free to Pro conversion rate (target: 10%)
- Time to conversion (days)
- Upgrade trigger points (which feature drove upgrade)

### Retention
- Day 1, 7, 30 retention rates
- Churn rate
- Feature usage patterns

### Business
- Monthly recurring revenue (MRR)
- Customer lifetime value (LTV)
- Customer acquisition cost (CAC)
- LTV:CAC ratio

---

## Marketing Strategy

### Target Audience
- College students (primary)
- High school students (secondary)
- Certification exam takers
- Lifelong learners

### Channels
- Reddit (r/studying, r/college, r/GetStudying)
- YouTube tutorials and demos
- TikTok/Instagram (study content creators)
- Product Hunt launch
- Student Facebook groups
- Discord communities

### Content Marketing
- Blog posts: "How to Study Effectively", "Spaced Repetition Guide"
- Case studies: "Student A improved scores by 20%"
- Study guides and templates
- Comparison articles: vs. traditional methods, vs. other apps

### Growth Tactics
- Generous free tier as lead magnet
- Referral program (free month for referrer and referee)
- Student ambassador program
- University partnerships
- Free workshops on effective studying

---

## Technical Considerations

### Performance
- Optimize document processing (chunking, parallel processing)
- Cache Gemini responses where possible
- Lazy load images and heavy components
- Use React Server Components for data fetching

### Security
- Hash passwords with bcrypt
- Validate all inputs with Zod
- Rate limiting on API routes
- CORS configuration
- Secure file upload (virus scanning, type validation)
- SQL injection prevention (Prisma handles this)

### Scalability
- Start with Vercel serverless (handles most scale)
- Database connection pooling
- Redis for caching (future)
- CDN for static assets
- Background jobs for heavy processing (future)

### Monitoring
- Error tracking (Sentry)
- Analytics (Plausible or PostHog)
- Performance monitoring (Vercel Analytics)
- User feedback collection

---

## Environment Variables

### Required
- DATABASE_URL (Postgres connection)
- NEXTAUTH_SECRET (session encryption)
- NEXTAUTH_URL (app URL)
- GEMINI_API_KEY (Google AI)
- NEXT_PUBLIC_APP_URL (frontend)

### Optional (for features)
- GOOGLE_CLIENT_ID (OAuth)
- GOOGLE_CLIENT_SECRET (OAuth)
- STRIPE_SECRET_KEY (payments)
- STRIPE_WEBHOOK_SECRET (webhook verification)
- SUPABASE_URL (if using Supabase)
- SUPABASE_SERVICE_ROLE_KEY (server-side)
- UPLOADTHING_SECRET (file uploads)

---

## Cost Breakdown

### Free Tier (Development)
- Gemini API: Free (60 req/min, 1500/day)
- Vercel: Free (100GB bandwidth)
- Supabase: Free (500MB DB, 1GB storage)
- Domain: $10-15/year
- **Total: ~$15/year**

### Paid Tier (After Growth)
- Vercel Pro: $20/month (if needed)
- Supabase Pro: $25/month (8GB DB, 2TB bandwidth)
- Stripe fees: 2.9% + $0.30 per transaction
- **Total: ~$45-50/month base + transaction fees**

### Break-Even Point
- Need ~5 paying users at $9.99/month to cover $45/month costs
- Very achievable once launched

---

## Competitive Advantages

### vs. Quizlet
- AI-generated content from YOUR documents
- Smarter spaced repetition
- Quiz generation, not just flashcards
- Analytics and study planning

### vs. Notion
- Purpose-built for studying
- AI-powered material generation
- Spaced repetition built-in
- Progress tracking

### vs. ChatGPT
- Persistent document library
- Organized study materials
- Progress tracking over time
- Specialized study features

---

## Future Enhancements (Post-MVP)

### Features
- Mobile apps (React Native)
- Browser extension (generate from any webpage)
- Video/audio lecture processing
- OCR for handwritten notes
- Collaborative real-time editing
- AI voice tutor
- Gamification (XP, achievements, streaks)

### Integrations
- Google Classroom
- Canvas LMS
- Notion export
- Google Calendar sync
- Anki bidirectional sync

### AI Improvements
- Multi-modal learning (images, diagrams)
- Personalized learning paths
- Adaptive difficulty
- Peer comparison (anonymized)

---

## Launch Checklist

### Pre-Launch
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Test all authentication flows
- [ ] Test document upload/processing
- [ ] Test quiz generation and taking
- [ ] Test flashcard review
- [ ] Set up error monitoring
- [ ] Set up analytics
- [ ] Write privacy policy and terms
- [ ] Set up support email/system

### Launch Day
- [ ] Deploy to production
- [ ] Test all features in production
- [ ] Post on Product Hunt
- [ ] Share on Reddit
- [ ] Share on social media
- [ ] Email beta testers
- [ ] Monitor errors and performance
- [ ] Be ready for user feedback

### Post-Launch
- [ ] Collect user feedback
- [ ] Monitor key metrics
- [ ] Fix critical bugs quickly
- [ ] Iterate on UX based on feedback
- [ ] Plan next features based on usage
- [ ] Start content marketing
- [ ] Build email list
- [ ] Prepare for Pro tier launch