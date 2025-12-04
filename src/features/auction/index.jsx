import { useState, useEffect } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { toast } from 'react-toastify';
import { List } from '../../components';
import api from '../../services/api';
// import AuctionForm from './components/AuctionForm';

const Auction = () => {
    const [auctions, setAuctions] = useState([]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = () => {
        setLoading(true);
        // Usa a rota pública para ver todos ou cria uma rota específica no back para "meus leilões"
        // Aqui assumindo que o admin pode ver tudo na rota padrão ou pública
        api.get('/auctions/public').then(response => {
            setAuctions(response.data.dados.content || response.data.dados); // Ajuste conforme paginação
        }).catch(error => {
            toast.error('Erro ao buscar leilões');
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleOpenModal = () => {
        setSelectedAuction(null);
        setIsNew(true);
        setIsDialogVisible(true);
    };

    const handleEdit = (auction) => {
        setSelectedAuction(auction);
        setIsNew(false);
        setIsDialogVisible(true);
    };

    const handleSave = (auctionData) => {
        const url = isNew ? '/auctions' : `/auctions/${selectedAuction.id}`;
        const method = isNew ? 'post' : 'put';
        const action = isNew ? 'criado' : 'atualizado';

        api[method](url, auctionData)
            .then(() => {
                toast.success(`Leilão ${action} com sucesso.`);
                setIsDialogVisible(false);
                fetchAuctions();
            })
            .catch(error => {
                const message = error.response?.data?.mensagem || `Falha ao salvar leilão`;
                toast.error(message);
            });
    };

    const handleDelete = (auction) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir o leilão "${auction.title}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                api.delete(`/auctions/${auction.id}`)
                    .then(() => {
                        toast.success('Leilão excluído com sucesso.');
                        fetchAuctions();
                    })
                    .catch(() => toast.error('Falha ao excluir leilão'));
            }
        });
    };

    const statusBodyTemplate = (rowData) => {
        const severity = {
            'OPENED': 'success',
            'CLOSED': 'danger',
            'IN_REVIEW': 'warning',
            'CANCELED': 'secondary'
        };
        return <Tag value={rowData.status} severity={severity[rowData.status] || 'info'} />;
    };

    const priceBodyTemplate = (rowData) => {
        return rowData.minimumBid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="card m-4">
            <ConfirmDialog />
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Gerenciamento de Leilões</h1>
            </div>

            <List
                data={auctions}
                loading={loading}
                onNew={handleOpenModal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                filterFields={['title', 'description']}
            >
                <Column field="id" header="ID" sortable style={{ width: '5rem' }} />
                <Column field="title" header="Título" sortable />
                <Column field="category.name" header="Categoria" sortable />
                <Column field="minimumBid" header="Lance Min." body={priceBodyTemplate} sortable />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable />
            </List>

            {/* <AuctionForm
                visible={isDialogVisible}
                onHide={() => setIsDialogVisible(false)}
                onSave={handleSave}
                data={selectedAuction}
                isNew={isNew}
            /> */}
        </div>
    );
};

export default Auction;