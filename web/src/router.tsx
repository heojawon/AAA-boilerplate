import { createBrowserRouter } from "react-router";
import NotFound from "./components/NotFound";
import Landingpage from "./features/Landingpage";
import Auth from "./features/auth/Auth";
import TermsPage from "./features/auth/components/TermsPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Landingpage />,
    },
    {
        path: "/auth",
        element: <Auth />,
    },
    {
        path: "/terms",
        element: <TermsPage />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
