import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { PortfolioItem } from "../../../types";
import PortfolioDetail from "../../../components/Portfolio/PortfolioDetail/portfolioDetail";

export default function PortfolioDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<PortfolioItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('ID не указан');
            setLoading(false);
            return
        }
        const fetchDetail = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/portfolio/${id}`);
                if (!response.ok) {
                    throw new Error('Работа не найдена');
                }
                const data: PortfolioItem = await response.json();
                setItem(data);
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки')
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [id]);

    if (loading) {
        return <div className="page-container">Загрузка работы</div>;
    }

    if (error) {
        return <div className="page-container">Ошибка загрузки {error}</div>;
    }

    if (!item) {
        return <div className="page-container">Работа не найдена</div>;
    }

    return <PortfolioDetail item={item} />;
}