# carousel-beer-dashboard

## Stack
- **Framework**: Next.js 16 (App Router)
- **Linter/Formatter**: Biome
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (style: default, base color: neutral)
- **Icons**: lucide-react

## Project Structure
```
app/          # Next.js App Router pages and layouts
components/   # React components
  ui/         # shadcn/ui components
lib/          # Utilities
  utils.ts    # cn() helper (clsx + tailwind-merge)
public/       # Static assets
```

## Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run Biome (lint + format check)
npm run lint:fix   # Auto-fix lint issues
npm run format     # Auto-format files
```

## Path Aliases
- `@/*` → root directory

## Context7 Library IDs
- **Next.js 16**: `/vercel/next.js/v16.1.6`
- **next-intl**: `/amannn/next-intl`
- **Supabase**: `/supabase/supabase`
- **Supabase SSR**: `/supabase/ssr`

## Component Guidelines
- Add shadcn/ui components with: `npx shadcn@latest add <component>`
- Use `cn()` from `@/lib/utils` for conditional class merging
- Place shared UI components in `components/ui/`
- Place feature components in `components/`
