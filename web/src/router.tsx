import { createBrowserRouter } from "react-router";
import NotFound from "./components/NotFound";
import { Main } from "./App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
