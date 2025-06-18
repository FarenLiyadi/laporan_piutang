import "../css/app.css";
import "./bootstrap";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MaterialTailwindControllerProvider } from "./context";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <BrowserRouter>
                <ThemeProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        closeOnClick
                        draggable={false}
                        theme="dark"
                    />
                    <MaterialTailwindControllerProvider>
                        <App {...props} />
                    </MaterialTailwindControllerProvider>
                </ThemeProvider>
            </BrowserRouter>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
