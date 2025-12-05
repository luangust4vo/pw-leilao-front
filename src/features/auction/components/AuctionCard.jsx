import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from '../../../components';

const AuctionCard = ({ auction }) => {
    const navigate = useNavigate();

    const getSeverity = (status) => {
        switch (status) {
            case 'OPENED': return 'success';
            case 'CLOSED': return 'danger';
            case 'IN_REVIEW': return 'warning';
            default: return 'info';
        }
    };

    const getStatusLabel = (status) => {
        const labels = { 'OPENED': 'Aberto', 'CLOSED': 'Encerrado', 'IN_REVIEW': 'Em Breve', 'CANCELED': 'Cancelado' };
        return labels[status] || status;
    };

    const imageUrl = auction.coverImage || '';

    const goToDetails = (e) => {
        if (e) e.stopPropagation();
        navigate(`/auctions/${auction.id}`);
    };

    return (
        <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2 p-2">
            <Card hoverable onClick={goToDetails} className="p-3 h-full flex flex-column justify-content-between">
                <div>
                    <div className="flex align-items-center justify-content-between mb-2">
                        <span className="text-xs text-500 font-bold uppercase overflow-hidden white-space-nowrap text-overflow-ellipsis" style={{ maxWidth: '60%' }}>
                            {auction.categoryName}
                        </span>
                        <Tag value={getStatusLabel(auction.status)} severity={getSeverity(auction.status)} style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem' }} rounded />
                    </div>

                    <div className="flex justify-content-center align-items-center mb-2 h-10rem bg-gray-50 border-round-md overflow-hidden relative">
                        <img
                            src={imageUrl}
                            alt={auction.title}
                            className="w-full h-full"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    <div className="flex flex-column gap-1">
                        <div
                            className="text-lg font-bold text-900 white-space-nowrap overflow-hidden text-overflow-ellipsis"
                            title={auction.title}
                        >
                            {auction.title}
                        </div>

                        <div className="text-sm text-600" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '2.4em',
                            lineHeight: '1.2'
                        }}>
                            {auction.description}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mt-3 mb-2 flex align-items-end gap-2">
                        <span className="text-xs text-500 mb-1">Lance:</span>
                        <span className="text-xl font-bold text-primary">
                            {auction.minimumBid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>

                    <Button
                        label="Detalhes"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        size="small"
                        className="w-full py-1 text-sm border-round-md"
                        outlined
                        onClick={goToDetails}
                    />
                </div>

            </Card>
        </div>
    );
};

export default AuctionCard;