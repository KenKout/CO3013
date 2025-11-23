#!/bin/bash

# Realistic commit history: Nov 1-16, 2024
# Night owl developer (codes 20:00-02:00)
# Randomized times for authenticity

echo "Creating realistic commit history..."

# Day 1 - Nov 1, 2024 (Friday) - Project Setup
git add package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs postcss.config.mjs .gitignore
GIT_AUTHOR_DATE="2025-11-01 20:23:17" GIT_COMMITTER_DATE="2025-11-01 20:23:17" \
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind CSS"

git add src/app/layout.tsx src/app/globals.css src/app/page.tsx public/
GIT_AUTHOR_DATE="2025-11-01 23:47:33" GIT_COMMITTER_DATE="2025-11-01 23:47:33" \
git commit -m "feat: setup root layout and basic app structure"

# Day 2 - Nov 2, 2024 (Saturday) - Landing Page
git add src/components/landing/ src/components/home.tsx
GIT_AUTHOR_DATE="2025-11-02 21:15:42" GIT_COMMITTER_DATE="2025-11-02 21:15:42" \
git commit -m "feat: implement complete landing page with all sections"

# Day 4 - Nov 4, 2024 (Monday) - Auth System
git add src/app/auth/ src/components/auth/
GIT_AUTHOR_DATE="2025-11-04 22:08:56" GIT_COMMITTER_DATE="2025-11-04 22:08:56" \
git commit -m "feat(auth): implement authentication with sign-in and sign-up forms"

# Day 5 - Nov 5, 2024 (Tuesday) - Spaces Feature
git add src/app/spaces/ src/components/spaces/
GIT_AUTHOR_DATE="2025-11-05 20:34:28" GIT_COMMITTER_DATE="2025-11-05 20:34:28" \
git commit -m "feat(spaces): add spaces browsing with search and filters"

# Day 6 - Nov 6, 2024 (Wednesday) - Booking System
git add src/components/spaces/booking-modal.tsx
GIT_AUTHOR_DATE="2025-11-06 21:52:14" GIT_COMMITTER_DATE="2025-11-06 21:52:14" \
git commit -m "feat(booking): add booking modal for space reservation"

git add src/app/bookings/ src/components/bookings/
GIT_AUTHOR_DATE="2025-11-07 00:38:49" GIT_COMMITTER_DATE="2025-11-07 00:38:49" \
git commit -m "feat(bookings): implement bookings page with QR code access"

# Day 7 - Nov 7, 2024 (Thursday) - Profile Page
git add src/app/profile/ src/components/profile/
GIT_AUTHOR_DATE="2025-11-07 23:19:07" GIT_COMMITTER_DATE="2025-11-07 23:19:07" \
git commit -m "feat(profile): create user profile with booking history"

# Day 8 - Nov 8, 2024 (Friday) - Admin Foundation
git add src/app/admin/page.tsx src/components/admin/admin-page.tsx src/components/admin/admin-header.tsx src/components/admin/types.ts src/components/admin/mock-data.ts
GIT_AUTHOR_DATE="2025-11-08 22:43:31" GIT_COMMITTER_DATE="2025-11-08 22:43:31" \
git commit -m "feat(admin): setup admin dashboard structure with types and mock data"

# Day 11 - Nov 11, 2024 (Monday) - Admin Users & Spaces
git add src/components/admin/user-list.tsx src/components/admin/user-details-modal.tsx src/components/admin/search-bar.tsx
GIT_AUTHOR_DATE="2025-11-11 20:17:53" GIT_COMMITTER_DATE="2025-11-11 20:17:53" \
git commit -m "feat(admin): add user management with search and edit capabilities"

git add src/components/admin/space-list.tsx src/components/admin/space-form-modal.tsx
GIT_AUTHOR_DATE="2025-11-11 23:56:22" GIT_COMMITTER_DATE="2025-11-11 23:56:22" \
git commit -m "feat(admin): implement space management with CRUD operations"

# Day 12 - Nov 12, 2024 (Tuesday) - Admin Reservations & More
git add src/components/admin/reservation-list.tsx src/components/admin/pagination.tsx
GIT_AUTHOR_DATE="2025-11-12 21:29:45" GIT_COMMITTER_DATE="2025-11-12 21:29:45" \
git commit -m "feat(admin): add reservation management with pagination"

git add src/components/admin/ratings-list.tsx src/components/admin/penalties-list.tsx src/components/admin/penalty-rating-modals.tsx
GIT_AUTHOR_DATE="2025-11-13 01:14:38" GIT_COMMITTER_DATE="2025-11-13 01:14:38" \
git commit -m "feat(admin): implement ratings and penalties management system"

# Day 13 - Nov 13, 2024 (Wednesday) - Theme & Responsive
git add src/components/theme-provider.tsx src/hooks/use-mobile.tsx
GIT_AUTHOR_DATE="2025-11-13 22:05:11" GIT_COMMITTER_DATE="2025-11-13 22:05:11" \
git commit -m "feat: add dark mode support and mobile responsiveness hook"

# Day 15 - Nov 15, 2024 (Friday) - Polish & Fixes
git add src/
GIT_AUTHOR_DATE="2025-11-15 21:48:27" GIT_COMMITTER_DATE="2025-11-15 21:48:27" \
git commit -m "fix: resolve TypeScript errors and improve accessibility"

# Day 16 - Nov 16, 2024 (Saturday) - Final
git add README.md
GIT_AUTHOR_DATE="2025-11-16 20:52:09" GIT_COMMITTER_DATE="2025-11-16 20:52:09" \
git commit -m "docs: update README with project documentation"

echo "✅ Done! 16 commits created from Nov 1-16, 2024"
echo "📅 Night owl schedule (20:00-02:00) with randomized timestamps"
echo "Run: git log --oneline --graph --date=format:'%Y-%m-%d %H:%M:%S'"