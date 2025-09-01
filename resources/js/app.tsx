import '../css/app.css';

import AppLayout from '@/layouts/app-layout';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) => {
        type WithLayout = React.ComponentType & {
            layout?: (page: React.ReactElement) => React.ReactNode;
        };

        const pages = import.meta.glob<{ default: WithLayout }>('./pages/**/*.tsx', { eager: true });

        const pageModule = pages[`./pages/${name}.tsx`];
        if (!pageModule?.default) throw new Error(`Page not found: ${name}`);

        const Page = pageModule.default;

        // Only apply AppLayout when authed; otherwise use GuestLayout (or return page as-is)
        Page.layout ??= (pageEl: React.ReactElement) => {
            const props = (pageEl.props ?? {}) as { auth?: { user?: unknown } };
            const authed = !!props.auth?.user;

            return authed ? <AppLayout>{pageEl}</AppLayout> : pageEl; // or just: pageEl
        };

        return Page;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});

// Theme init
initializeTheme();
