import { createBrowserRouter } from "react-router";
import NotFound from "./components/NotFound";
import Landingpage from "./features/Landingpage";
import Auth from "./features/auth/Auth";
import TermsPage from "./features/auth/components/TermsPage";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

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
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
