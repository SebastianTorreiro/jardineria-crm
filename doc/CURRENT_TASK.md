# Current Task: HOTFIX - Standardize Google Maps Universal Links (Phase 3.5)

**Target Files:**
- `src/components/clients/ClientCard.tsx`
- `src/app/(dashboard)/clients/[id]/page.tsx`
- `src/components/visits/VisitCard.tsx`

**Objective:** Replace the currently implemented non-standard Google Maps URLs with the official, cross-platform Google Maps Search API URL scheme to ensure native app deep-linking on both iOS and Android.

**Execution Requirements:**
1. **Audit & Replace:** Scan the target files for any `<a>` tags containing `http://googleusercontent.com/maps.google.com/...`.
2. **Apply Official Standard:** Replace the `href` attribute with the official search URL format: 
   `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
3. **Preserve UI/UX:** Do NOT alter any Tailwind classes, icons, Z-index configurations, or `target="_blank"` attributes. The buttons and links must look and behave visually exactly as they do now.
4. **Resilience:** Ensure `encodeURIComponent` is properly used so spaces and special characters in addresses (like "Brandsen y Malabia") do not break the URL structure.

**Constraints:**
- Do NOT modify any database schemas, server actions, or Next.js routing. This is purely a string replacement in the frontend components.