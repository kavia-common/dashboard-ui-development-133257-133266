# Dashboard Frontend with Tailwind CSS

This React app uses Tailwind CSS for all component and layout styling. No external chart libraries are used; primitives simulate charts and gauges using CSS.

How to run:
- npm install
- npm start

Key features:
- Sidebar navigation across 10 sections
- Global toolbar with filters, search, export buttons
- Light/Dark theme toggle (Tailwind dark mode)
- Role-based rendering scaffolding (placeholder roles in App.js)
- Mocked data for widgets and clear interfaces for future API integration
- Accessible components (labels, aria attributes, keyboard-friendly)

To change roles:
- In src/App.js, edit the rbac roles array to include roles such as "KAVIA_ADMIN", "FINANCE", etc.
