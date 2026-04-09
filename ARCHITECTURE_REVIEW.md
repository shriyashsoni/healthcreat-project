# HealthRouter - Architecture Review & Optimization Report

**Date:** April 2026  
**Project:** HealthRouter (healthcreat-project)  
**Status:** Review for optimization and best practices alignment

---

## Executive Summary

The HealthRouter project is a well-structured Next.js 16 application implementing a two-phase AI triage system for patient routing to medical specialists. The architecture demonstrates solid engineering foundations with modern tooling and clean separation of concerns. This review identifies opportunities to improve maintainability, scalability, and adherence to Next.js best practices.

**Key Strengths:** Component organization, API design, theme system  
**Areas for Optimization:** Code splitting, configuration clarity, documentation, error handling

---

## 1. PROJECT STRUCTURE ANALYSIS

### Current Directory Organization

```
healthcreat-project/
├── src/
│   ├── app/
│   │   ├── (root)
│   │   │   ├── page.tsx           # Landing page (monolithic)
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── globals.css        # Design tokens & styles
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts       # Two-phase LLM routing
│   │   ├── chat/
│   │   │   └── page.tsx           # Chat interface
│   │   ├── login/
│   │   │   └── page.tsx           # Auth page
│   │   └── settings/
│   │       └── page.tsx           # Settings page (placeholder)
│   └── components/
│       └── AuthButton.tsx         # Reusable auth component
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── eslint.config.mjs
└── README.md
```

### Assessment: Structure Quality

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Clarity** | ✅ Good | App Router routing is intuitive; pages are at correct paths |
| **Scalability** | ⚠️ Fair | No utility folders, all components in root components/ |
| **Reusability** | ⚠️ Fair | Landing page monolithic; sections not extracted |
| **Maintainability** | ⚠️ Fair | No shared utilities, hooks, types, or constants folders |
| **Convention** | ✅ Good | Follows Next.js 16 App Router conventions |

---

## 2. LANDING PAGE ARCHITECTURE (`/page.tsx`)

### Current Implementation: 300+ lines monolithic component

**Issues Identified:**

1. **Lack of Component Extraction**
   - All 9 sections (nav, hero, visual, how-it-works, impact, features, CTA, footer) are inline
   - Hard to test, reuse, or modify individual sections
   - Difficult to maintain—scrolling through 300+ lines to find changes

2. **Inline Data Structures**
   - "How it works" steps hardcoded with `.map()`
   - Impact stats hardcoded inline
   - No separation between data and presentation

3. **No Layout Wrapper**
   - Navigation is specific to landing page
   - Makes it hard to reuse nav on other pages

### Recommended Optimizations

**Refactor Structure:**
```
src/components/
├── landing/
│   ├── Navigation.tsx           # Sticky navbar (reusable)
│   ├── HeroSection.tsx          # Hero content
│   ├── VisualSection.tsx        # Abstract visual band
│   ├── HowItWorks.tsx          # Process steps
│   ├── ImpactStats.tsx         # Community metrics
│   ├── FeaturesGrid.tsx        # Technology cards
│   ├── FinalCTA.tsx            # Call-to-action section
│   └── Footer.tsx              # Footer (reusable)
├── shared/
│   ├── Header.tsx              # App header (for chat, settings, etc.)
│   └── Button.tsx              # Reusable button with variants
└── AuthButton.tsx              # (existing)
```

**Benefits:**
- Each component is < 50 lines
- Sections can be tested independently
- Navigation can be reused on auth pages
- Easier to A/B test sections
- Improves readability and onboarding for new developers

---

## 3. COMPONENT ORGANIZATION

### Current State

**Strengths:**
- `AuthButton.tsx` is properly extracted and reusable
- Chat interface component is self-contained with good state management
- Clear separation between client and server components

**Areas for Improvement:**

1. **No Shared Component Folder**
   - Buttons, cards, inputs should be extracted
   - `Button` variations used throughout (primary, secondary, icon)
   - Message bubble patterns repeated in chat

2. **Missing Utility Hooks**
   - Chat scroll behavior could be in a custom hook (`useScrollToBottom`)
   - No reusable form handling utilities

3. **No Global Layout Components**
   - Each page recreates header structure
   - Footer logic is inline

### Recommended Structure

```
src/components/
├── ui/                         # Atomic design system
│   ├── Button.tsx             # Base button component
│   ├── Input.tsx              # Text input with states
│   ├── Card.tsx               # Card wrapper
│   └── Badge.tsx              # Small label/tag
├── shared/                     # App-wide components
│   ├── Header.tsx             # App header
│   ├── Footer.tsx             # App footer
│   └── Navigation.tsx         # Main nav
├── landing/                    # Landing page sections
├── chat/                       # Chat feature components
│   ├── MessageBubble.tsx
│   ├── ChatInput.tsx
│   └── ChatContainer.tsx
└── auth/                       # Auth components
    └── AuthButton.tsx
```

---

## 4. ROUTING & APP STRUCTURE

### Current Routes

| Route | Purpose | Status | Notes |
|-------|---------|--------|-------|
| `/` | Landing page | ✅ Complete | Monolithic, needs refactor |
| `/chat` | Symptom triage | ✅ Complete | Good UX, solid implementation |
| `/login` | Authentication | ✅ Exists | Supabase auth redirect |
| `/settings` | User settings | ⚠️ Placeholder | No implementation |
| `/api/chat` | LLM routing | ✅ Complete | Two-phase pipeline working |

### Assessment

**Strengths:**
- App Router usage is correct
- Route hierarchy is logical
- API route follows Next.js conventions

**Recommendations:**
1. **Implement settings page** - User preferences, language selection, privacy settings
2. **Add layout.tsx for chat routes** - Separate navigation from landing page
3. **Consider auth middleware** - Use `middleware.ts` (or `proxy.js` in Next.js 16) for protected routes
4. **Add error boundaries** - Implement `error.tsx` for graceful error handling

---

## 5. STYLING & DESIGN TOKEN SYSTEM

### Current Implementation: TailwindCSS v4 + Custom Design Tokens

**Excellent Design Token System:**
```css
--color-bg-primary:     #EDEAE2  (Beige)
--color-bg-secondary:   #1A1A1A  (Black)
--color-bg-card:        #E2DDD5  (Light beige)
--color-text-primary:   #111111  (Dark)
--color-text-secondary: #555555  (Gray)
--color-accent-blue:    #1B4FD8  (Blue)
--color-accent-green:   #2D6A4F  (Green)
--color-border-light:   #D4CFC7  (Light border)
--color-border-dark:    #333333  (Dark border)
```

**Strengths:**
- ✅ Consistent color system (3-4 core colors + accents)
- ✅ Semantic naming (not `blue-500` but `accent-blue`)
- ✅ Proper dark mode support
- ✅ Uses TailwindCSS v4 inline theme (no config file needed)

**Recommendations:**
1. **Create shared color constants** - Extract to `src/lib/colors.ts`
2. **Add spacing scale documentation** - Define consistent spacing (4px, 8px, 16px, 24px units)
3. **Document typography scale** - Clarify heading/body sizing hierarchy
4. **Create Tailwind utility guide** - Standardize responsive breakpoints usage

---

## 6. API & BACKEND ARCHITECTURE

### Current Implementation: `/api/chat/route.ts`

**Architecture Pattern:**
- Two-phase AI routing system
- Phase 1 (intake): Meta Llama 3.1 8B for rapid clarification questions
- Phase 2 (routing): NVIDIA Nemotron 70B for clinical routing decisions
- Uses NVIDIA NIM API endpoints

**Strengths:**
- ✅ Clear phase separation logic
- ✅ Proper error handling with try-catch
- ✅ Validates input messages
- ✅ Uses environment variables for API keys
- ✅ Markdown formatting for readable responses

**Areas for Improvement:**

1. **Error Handling Could Be More Granular**
   ```typescript
   // Current: Generic error response
   // Better: Distinguish between validation, API, and config errors
   ```

2. **Response Type Inconsistency**
   - Response includes `role`, `content`, `isFinal` but these aren't typed
   - Should create a shared response type

3. **No Request Validation**
   - Messages array structure not validated
   - Should validate message format (role, content fields)

4. **Hardcoded System Prompts**
   - Should move to config or environment
   - Makes it hard to iterate on prompt engineering

### Recommended Improvements

**Create types file:**
```typescript
// src/lib/types.ts
export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatResponse = {
  role: 'assistant';
  content: string;
  isFinal: boolean;
};
```

**Create system prompts file:**
```typescript
// src/lib/prompts.ts
export const INTAKE_PROMPT = `...`;
export const ROUTING_PROMPT = `...`;
```

**Improve validation:**
```typescript
// src/lib/validation.ts
export function validateMessages(messages: unknown): ChatMessage[] {
  // Proper validation logic
}
```

---

## 7. CONFIGURATION FILES

### Current Setup

| File | Status | Notes |
|------|--------|-------|
| `next.config.ts` | ✅ Minimal | Clean, no overrides needed |
| `tsconfig.json` | ✅ Standard | Proper path aliases setup |
| `tailwind.config.ts` | ✅ N/A | Using inline theme in globals.css (v4) |
| `eslint.config.mjs` | ✅ Standard | Using Next.js ESLint config |

**Recommendations:**
1. **Verify production optimizations** - Check `next.config.ts` for:
   - Image optimization settings
   - Environment variable exposure
   - Build-time options

2. **Add path aliases clarity** - Document what each alias is for:
   ```json
   {
     "@/*": ["./src/*"],           // Main app code
     "@/components/*": ["./src/components/*"],
     "@/lib/*": ["./src/lib/*"],
     "@/app/*": ["./src/app/*"]
   }
   ```

3. **Security checklist:**
   - API keys only in `.env.local` ✅
   - No sensitive data in `.env.public` ✅
   - CORS handled properly ✅

---

## 8. DEPENDENCY MANAGEMENT

### Current Dependencies

**Production:**
```json
"@ai-sdk/openai": "^3.0.52",     // AI SDK (not currently used?)
"@supabase/ssr": "^0.10.2",      // Supabase auth
"@vercel/analytics": "^2.0.1",   // Analytics
"ai": "^6.0.154",                // Vercel AI SDK (not used?)
"framer-motion": "^12.38.0",     // Animations
"lucide-react": "^1.8.0",        // Icons
"openai": "^6.34.0"              // OpenAI SDK (using NVIDIA)
```

**Issues:**
1. **Unused dependencies detected:**
   - `@ai-sdk/openai` - Not imported anywhere
   - `ai` (Vercel AI SDK) - Not using AI SDK features, using OpenAI SDK directly
   - These should be removed for smaller bundle

2. **OpenAI SDK for NVIDIA API:**
   - Using `openai` package but for NVIDIA endpoints
   - This works but is semantically confusing
   - Consider documenting or abstracting

### Optimization Recommendations

1. **Remove unused packages:**
   ```bash
   # Remove if not used:
   @ai-sdk/openai
   ai
   ```

2. **Create API client abstraction:**
   ```typescript
   // src/lib/llm/client.ts
   export class LLMClient {
     async chat(messages, model) {
       // Handle both Llama 8B and Nemotron 70B
     }
   }
   ```

3. **Add bundle analysis:**
   ```bash
   npm install -D @next/bundle-analyzer
   ```

---

## 9. ENVIRONMENT CONFIGURATION

### Required Environment Variables

```
NVIDIA_LLAMA_8B_API_KEY         # Phase 1: Intake
NVIDIA_NEMOTRON_70B_API_KEY     # Phase 2: Routing
NEXT_PUBLIC_SUPABASE_URL        # Supabase (optional for auth)
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase (optional for auth)
```

### Recommendations

1. **Create `.env.example` file** - Document all required environment variables
2. **Add validation at startup** - Check required variables in `layout.tsx` or middleware
3. **Create environment docs** - Add `docs/ENV_SETUP.md` with setup instructions

---

## 10. DOCUMENTATION & DEVELOPER EXPERIENCE

### Current State

**Strengths:**
- Code is readable and well-commented
- Component props are typed

**Missing Documentation:**

1. **No Architecture Documentation**
   - How does the two-phase system work?
   - Why Llama 8B then Nemotron 70B?
   - Where is the specialist routing logic?

2. **No Setup Instructions**
   - README is boilerplate
   - No step-by-step setup guide for new developers

3. **No API Documentation**
   - Chat API endpoint not documented
   - Response format not documented
   - Error codes not documented

### Recommended Documentation Files

Create these files:
- `docs/ARCHITECTURE.md` - System design, two-phase flow
- `docs/API.md` - API endpoint documentation
- `docs/SETUP.md` - Development environment setup
- `docs/DEVELOPMENT.md` - Development guidelines
- `.env.example` - Environment variable template

---

## 11. PERFORMANCE OPTIMIZATIONS

### Current State Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| Code splitting | ⚠️ Fair | Landing page is monolithic |
| Image optimization | ✅ Good | Using icons only, no large images |
| Font loading | ✅ Good | Using Google Fonts with next/font |
| API calls | ✅ Good | Proper async handling |
| Bundle size | ⚠️ Fair | Unused dependencies present |

### Optimization Actions

1. **Extract landing page sections** - Reduce main bundle by ~30KB
2. **Implement route-based code splitting** - Each route loads only needed components
3. **Remove unused dependencies** - `@ai-sdk/openai`, `ai` package
4. **Add dynamic imports for heavy components** - If any animation-heavy sections exist

---

## 12. SECURITY REVIEW

### Current Implementation

| Check | Status | Notes |
|-------|--------|-------|
| **API Key Management** | ✅ Secure | Keys in `.env.local` only |
| **Input Validation** | ⚠️ Basic | Messages array checked but content not validated |
| **CORS** | ✅ Proper | External API calls handled server-side |
| **Authentication** | ✅ Setup | Supabase auth integrated |
| **SQL Injection** | N/A | No database queries directly |
| **XSS Protection** | ⚠️ Risk | Chat uses `dangerouslySetInnerHTML` for markdown |

### Security Improvements

1. **Sanitize Markdown Output**
   ```typescript
   // Current: dangerouslySetInnerHTML with basic regex
   // Better: Use marked library with DOMPurify
   import DOMPurify from 'dompurify';
   const clean = DOMPurify.sanitize(marked(content));
   ```

2. **Validate Message Content**
   ```typescript
   // Add length limits, character validation
   if (content.length > 5000) throw new Error('Message too long');
   ```

3. **Rate Limiting**
   - Consider adding rate limiting to `/api/chat`
   - Prevent abuse of expensive LLM calls

4. **Add Security Headers** 
   - Configure in `next.config.ts`:
   ```typescript
   async headers() {
     return [{
       source: '/:path*',
       headers: [
         { key: 'X-Content-Type-Options', value: 'nosniff' },
         { key: 'X-Frame-Options', value: 'DENY' },
       ]
     }]
   }
   ```

---

## 13. TESTING RECOMMENDATIONS

### Current State
- No test files present
- No test configuration

### Recommended Setup

**Testing Strategy:**
```
src/
├── components/
│   ├── AuthButton.tsx
│   ├── AuthButton.test.tsx      # Component tests
│   └── ...
├── lib/
│   ├── validation.ts
│   ├── validation.test.ts       # Unit tests
│   └── ...
└── app/
    └── api/
        ├── chat/
        │   ├── route.ts
        │   └── route.test.ts     # API route tests
        └── ...
```

**Testing Pyramid:**
1. **Unit Tests** - `validation.ts`, helper functions
2. **Component Tests** - AuthButton, chat components
3. **Integration Tests** - API routes
4. **E2E Tests** - Landing page flow, chat interaction

---

## 14. OPTIMIZATION CHECKLIST & ACTION ITEMS

### Priority 1: Critical (Do First)

- [ ] **Extract landing page into components** (HeroSection, HowItWorks, Features, etc.)
- [ ] **Remove unused dependencies** (`@ai-sdk/openai`, `ai`)
- [ ] **Add input validation** for chat messages (length, character limits)
- [ ] **Sanitize markdown output** (use `marked` + `DOMPurify`)
- [ ] **Create types file** (`src/lib/types.ts`) for shared types
- [ ] **Add `.env.example`** file documenting all required variables

### Priority 2: High (Next Sprint)

- [ ] **Move system prompts to config** (`src/lib/prompts.ts`)
- [ ] **Create LLM client abstraction** (`src/lib/llm/client.ts`)
- [ ] **Add API documentation** (`docs/API.md`)
- [ ] **Implement error boundaries** (`error.tsx` for routes)
- [ ] **Add middleware for auth** (protect `/settings` route)
- [ ] **Create layout for chat routes** (separate from landing)

### Priority 3: Medium (Future Sprints)

- [ ] **Extract shared components** (Button, Input, Card, Badge)
- [ ] **Add security headers** to `next.config.ts`
- [ ] **Implement rate limiting** on `/api/chat`
- [ ] **Add unit tests** for validation and utilities
- [ ] **Create component tests** for key components
- [ ] **Add analytics** (already have `@vercel/analytics`)

### Priority 4: Nice to Have

- [ ] **Add bundle analyzer** for monitoring size
- [ ] **Create design system documentation**
- [ ] **Add Storybook** for component library
- [ ] **Implement dark mode** (infrastructure exists)

---

## 15. FOLDER STRUCTURE RECOMMENDATION

### Final Recommended Structure

```
healthcreat-project/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (root)
│   │   │   ├── page.tsx              # Landing (refactored to use components)
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── globals.css           # Design tokens
│   │   ├── api/
│   │   │   └── chat/
│   │   │       ├── route.ts          # Chat API
│   │   │       └── types.ts          # Route-specific types
│   │   ├── chat/
│   │   │   ├── layout.tsx            # Chat app layout
│   │   │   └── page.tsx              # Chat page
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   └── settings/
│   │       └── page.tsx              # Settings page
│   ├── components/
│   │   ├── ui/                       # Reusable atomic components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── landing/                  # Landing page sections
│   │   │   ├── Navigation.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── ImpactStats.tsx
│   │   │   ├── FeaturesGrid.tsx
│   │   │   └── FinalCTA.tsx
│   │   ├── chat/                     # Chat components
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ChatContainer.tsx
│   │   ├── shared/                   # App-wide components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── AuthButton.tsx            # (existing)
│   ├── lib/                          # Utilities & helpers
│   │   ├── types.ts                  # Shared type definitions
│   │   ├── validation.ts             # Input validation
│   │   ├── colors.ts                 # Design token constants
│   │   ├── prompts.ts                # LLM system prompts
│   │   ├── hooks/                    # Custom React hooks
│   │   │   └── useScrollToBottom.ts
│   │   └── llm/                      # LLM client
│   │       └── client.ts
│   └── middleware.ts                 # Route protection (or proxy.js in Next.js 16)
├── docs/
│   ├── ARCHITECTURE.md               # System design documentation
│   ├── API.md                        # API endpoint documentation
│   ├── SETUP.md                      # Development setup guide
│   └── DEVELOPMENT.md                # Developer guidelines
├── .env.example                      # Environment variables template
├── .env.local                        # (local only, not in repo)
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── README.md                         # Updated with setup instructions
```

---

## 16. SUMMARY & RECOMMENDATIONS

### What's Working Well

1. **Modern Tech Stack** - Next.js 16, TypeScript, Tailwind CSS v4 ✅
2. **Clean Component Design** - AuthButton extraction shows good practices ✅
3. **Solid API Architecture** - Two-phase LLM system is well-designed ✅
4. **Design System** - Cohesive color tokens and theme strategy ✅
5. **Security Basics** - Environment variables handled correctly ✅

### Top 5 Improvements Needed

1. **Extract Landing Page Sections** - Break 300+ line monolithic component into reusable sections
2. **Create Shared Component Library** - Extract UI components (Button, Input, Card)
3. **Move Config Out of Code** - System prompts, constants to dedicated files
4. **Add Security Hardening** - Markdown sanitization, input validation, rate limiting
5. **Improve Documentation** - Architecture docs, API docs, setup instructions

### Implementation Timeline

**Week 1 (Priority 1):**
- Extract landing page components
- Remove unused dependencies
- Create types and validation files
- Add environment documentation

**Week 2 (Priority 2):**
- Create shared components library
- Move system prompts to config
- Implement API documentation
- Add error boundaries

**Week 3+ (Priority 3+):**
- Security hardening
- Testing infrastructure
- Performance monitoring
- Documentation completion

---

## 17. CONCLUSION

HealthRouter has a **solid architectural foundation** with modern tooling and clean patterns. The project is **ready for scale** with focused optimization. The recommended changes focus on:

1. **Code Organization** - Better component/utility separation
2. **Maintainability** - Extracted, reusable pieces
3. **Security** - Input validation, sanitization, rate limiting
4. **Developer Experience** - Documentation, clear conventions

By implementing these optimizations, the codebase will be:
- ✅ More scalable for future features
- ✅ Easier to maintain and update
- ✅ Better for onboarding new developers
- ✅ More secure and robust
- ✅ Aligned with Next.js best practices

**Recommended next step:** Start with Priority 1 actions while keeping development momentum on feature work.

---

**End of Architecture Review**

*For questions or clarifications about these recommendations, refer to specific section numbers above.*
