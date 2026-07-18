import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Sparkles } from "lucide-react";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-surface-bright flex flex-col items-center justify-center p-6">
                <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}
