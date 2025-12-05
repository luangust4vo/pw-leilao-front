import { useState, useEffect, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-toastify';

import api from '../../services/api';
import AuctionCard from './components/AuctionCard';

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const fetchAuctions = useCallback(() => {
        setLoading(true);

        api.get('/auctions/public?size=20')
            .then(response => {
                let data = response.data;
                if (typeof data === 'string') data = JSON.parse(data);

                const responseData = data.dados || {};
                const allAuctions = responseData.content || (Array.isArray(responseData) ? responseData : []);

                setAuctions(allAuctions);
            })
            .catch(error => {
                console.error(error);
                toast.error('Erro ao carregar vitrine.');
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchAuctions();
    }, [fetchAuctions]);

    return (
        <div className="surface-ground min-h-screen p-4">
            <div className="flex flex-column md:flex-row md:justify-content-between gap-3 align-items-center mb-4">
                <span className="text-3xl font-bold text-900">Vitrine de Leilões</span>
                <span className="p-input-icon-left w-full md:w-auto">
                    <i className="pi pi-search absolute top-50 -mt-2 px-2 text-gray-400" />
                    <InputText
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Buscar produtos..."
                        className="px-5 w-full border-round-2xl"
                    />
                </span>
            </div>

            {loading ? (
                <div className="flex justify-content-center align-items-center h-20rem">
                    <ProgressSpinner />
                </div>
            ) : auctions.length > 0 ? (
                <div className="grid">
                    {auctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-column align-items-center justify-content-center p-5 bg-white border-round-xl shadow-1">
                    <i className="pi pi-inbox text-5xl text-gray-400 mb-3"></i>
                    <span className="text-xl text-gray-600">Nenhum leilão encontrado.</span>
                </div>
            )}
        </div>
    )
}

export default AuctionList