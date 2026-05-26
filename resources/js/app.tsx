import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import '../css/app.css';

declare global {
    function route(name: string, params?: any): string;
}

createInertiaApp({
    title: (title) => title ? `${title} - ZenHR` : 'ZenHR',
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const { ziggy } = props.initialPage.props as any;
        (window as any).route = (name: string, params?: any) =>
            route(name, params, undefined, ziggy);
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#f5c842',
    },
});