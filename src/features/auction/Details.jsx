import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { toast } from 'react-toastify';

import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState(null);
    const [submittingBid, setSubmittingBid] = useState(false);

    const nextBidValue = auction ? (auction.currentBid + auction.incrementValue) : 0;

    const responsiveOptions = [
        { breakpoint: '991px', numVisible: 4 },
        { breakpoint: '767px', numVisible: 3 },
        { breakpoint: '575px', numVisible: 1 }
    ];

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/auctions/public/${id}`);

            let data = response.data;
            if (typeof data === 'string') data = JSON.parse(data);

            const auctionData = data.dados || data;
            setAuction(auctionData);

            if (auctionData) {
                setBidAmount(auctionData.nextBid);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar leilão.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails, id]);

    const handlePlaceBid = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!bidAmount) return;

        setSubmittingBid(true);

        try {
            await api.post('/bids', {
                auctionId: auction.id,
                amount: nextBidValue
            });

            toast.success('Lance realizado com sucesso!');
            fetchDetails();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.mensagem || 'Erro ao dar lance.';
            toast.error(msg);
        } finally {
            setSubmittingBid(false);
        }
    };

    const itemTemplate = (item) => {
        return <img src={item} alt="Imagem do produto" style={{ width: '100%', height: '500px', objectFit: 'contain', display: 'block', backgroundColor: '#f8f9fa' }} />;
    };

    const thumbnailTemplate = (item) => {
        return <img src={item} alt="Thumb" style={{ width: '80px', height: '60px', objectFit: 'cover', display: 'block', borderRadius: '4px' }} />;
    };

    const getStatusLabel = (status) => {
        const map = { 'OPENED': 'Aberto', 'CLOSED': 'Encerrado', 'IN_REVIEW': 'Em Breve', 'CANCELED': 'Cancelado' };
        return map[status] || status;
    };

    const getSeverity = (status) => {
        const map = { 'OPENED': 'success', 'CLOSED': 'danger', 'IN_REVIEW': 'warning', 'CANCELED': 'contrast' };
        return map[status] || 'info';
    };

    if (loading) {
        return <div className="flex justify-content-center align-items-center min-h-screen"><ProgressSpinner /></div>;
    }

    if (!auction) return null;

    const images = auction.imageUrls && auction.imageUrls.length > 0
        ? auction.imageUrls
        : ['https://primefaces.org/cdn/primereact/images/product/bamboo-watch.jpg'];

    const isOwner = user?.id === auction.sellerId;
    const isOpened = auction.status === 'OPENED';

    return (
        <div className="surface-ground min-h-screen p-4">
            <Button label="Voltar para Vitrine" icon="pi pi-arrow-left" text onClick={() => navigate('/')} className="mb-3" />

            <div className="grid">
                <div className="col-12 md:col-6 lg:col-7">
                    <Card className="shadow-2 border-round-xl p-0 overflow-hidden h-full">
                        <Galleria
                            value={images}
                            responsiveOptions={responsiveOptions}
                            numVisible={5}
                            style={{ maxWidth: '100%' }}
                            item={itemTemplate}
                            thumbnail={thumbnailTemplate}
                            showItemNavigators
                            showItemNavigatorsOnHover
                            circular
                            autoPlay
                            transitionInterval={4000}
                        />
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-5">
                    <Card className="shadow-2 border-round-xl h-full flex flex-column">
                        <div className="flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-500 font-bold uppercase text-sm tracking-wide">{auction.categoryName}</span>
                                <h1 className="text-3xl font-bold text-900 mt-2 mb-2">{auction.title}</h1>
                            </div>
                            <Tag value={getStatusLabel(auction.status)} severity={getSeverity(auction.status)} className="text-base px-3 py-2" rounded />
                        </div>

                        <p className="text-700 line-height-3 mb-4">{auction.description}</p>

                        <Divider />

                        <div className="surface-50 p-4 border-round-xl mb-4 border-1 surface-border">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <span className="text-600 font-medium">Valor Atual</span>
                                {isOpened && <span className="text-green-600 text-sm font-bold animate-pulse">● Recebendo Lances</span>}
                                {auction.bidCount > 0 && (
                                    <span className="text-sm text-500 bg-gray-100 px-2 py-1 border-round">
                                        {auction.bidCount} {auction.bidCount === 1 ? 'lance' : 'lances'}
                                    </span>
                                )}
                            </div>

                            <div className="text-5xl font-bold text-900 mb-4">
                                {auction.currentBid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>

                            <div className="grid text-sm">
                                <div className="col-6">
                                    <div className="text-500 mb-1">Incremento Mínimo</div>
                                    <div className="font-bold text-900">
                                        {auction.incrementValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-500 mb-1">Encerramento</div>
                                    <div className="font-bold text-900">
                                        {new Date(auction.endDateTime).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            {!isOpened ? (
                                <Message severity="info" text="Este leilão não está aceitando lances no momento." className="w-full justify-content-start" />
                            ) : !isAuthenticated ? (
                                <div className="flex flex-column gap-2 text-center p-4 border-1 border-dashed surface-border border-round">
                                    <i className="pi pi-lock text-3xl text-500 mb-2"></i>
                                    <span className="font-semibold text-900">Faça login para participar</span>
                                    <span className="text-600 text-sm mb-3">Você precisa de uma conta para dar lances neste produto.</span>
                                    <Button
                                        label="Entrar ou Cadastrar"
                                        icon="pi pi-user"
                                        onClick={() => navigate('/login')}
                                        className="w-full"
                                    />
                                </div>
                            ) : isOwner ? (
                                <Message severity="warn" text="Você é o proprietário deste leilão." className="w-full justify-content-start" />
                            ) : (
                                <div className="flex flex-column gap-3">
                                    <label className="font-bold text-900">Dê seu lance</label>
                                    <Button
                                        label="Confirmar"
                                        icon="pi pi-check"
                                        onClick={handlePlaceBid}
                                        loading={submittingBid}
                                    />
                                </div>
                            )}
                        </div>

                        <Divider />

                        <div className="flex align-items-center gap-3">
                            <Avatar icon="pi pi-user" shape="circle" size="large" className="surface-200 text-600" />
                            <div>
                                <span className="text-xs text-500 uppercase font-bold block">Vendido por</span>
                                <span className="text-900 font-medium">{auction.sellerName}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 mt-4">
                    <Panel header="Descrição Completa do Produto" toggleable className="shadow-2">
                        <p className="line-height-3 m-0 white-space-pre-line text-700 text-lg">
                            {auction.detailedDescription || "O vendedor não forneceu uma descrição detalhada."}
                        </p>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

const Avatar = ({ icon, className }) => (
    <div className={`flex align-items-center justify-content-center border-circle w-3rem h-3rem ${className}`}>
        <i className={icon}></i>
    </div>
);

export default Details;