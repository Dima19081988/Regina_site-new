import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../api/authApi";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const auth = await checkAuth();
                setIsAuthenticated(auth);
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        verifyAuth();
    }, []);

    if (loading) {
        return <div style={{ padding: '20px' }}>Проверка сессии...</div>
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}