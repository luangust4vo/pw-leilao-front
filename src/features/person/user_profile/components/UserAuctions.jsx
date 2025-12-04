import { useContext, useState, useEffect, useCallback } from "react";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { toast } from "react-toastify";

import { AuthContext } from "../../../../contexts/AuthContext";
import { List } from '../../../../components';
import AuctionForm from './AuctionForm';
import api from "../../../../services/api";

const UserAuctions = () => {
    const { user, updateUser } = useContext(AuthContext);

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    const canManageAuctions = user?.profiles?.some(profile => profile.type === 'ROLE_SELLER' || profile.type === 'ROLE_ADMIN');

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 5,
        page: 0
    });

    const fetchMyAuctions = useCallback((page, size) => {
        setLoading(true);

        api.get(`/auctions/me?page=${page}&size=${size}`)
            .then(response => {
                let data = response.data;
                if (typeof data === 'string') data = JSON.parse(data);

                const pageData = data.dados || {};

                setAuctions(pageData.content || []);
                setTotalRecords(pageData.totalElements || 0);
            })
            .catch(error => {
                console.error(error);
                toast.error('Erro ao buscar leilões.');
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (canManageAuctions) {
            fetchMyAuctions(lazyParams.first, lazyParams.rows);
        } else {
            setLoading(false);
        }
    }, [canManageAuctions, fetchMyAuctions, lazyParams]);

    const handleBecomeSeller = async () => {
        try {
            const response = await api.put('/people/me/become-seller', { profileType: 'ROLE_SELLER' });
            updateUser(response.data.dados);
            toast.success('Parabéns! Agora você pode criar leilões.');
        } catch (error) {
            toast.error('Erro ao atualizar perfil. Tente novamente mais tarde.');
            console.error('Error updating user role:', error);
        }
    }

    const handleOpenModal = () => {
        setSelectedAuction(null);
        setIsNew(true);
        setIsDialogVisible(true);
    };

    const handleEdit = (auction) => {
        if (auction.status === 'CLOSED' || auction.status === 'CANCELED') {
            toast.warn('Não é possível editar leilões encerrados.');
            return;
        }
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
                toast.success(`Leilão ${action} com sucesso!`);
                setIsDialogVisible(false);
                fetchMyAuctions();
            })
            .catch(error => {
                const message = error.response?.data?.mensagem || `Erro ao salvar leilão`;
                toast.error(message);
            });
    };

    const handleDelete = (auction) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir "${auction.title}"?`,
            header: 'Excluir Leilão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            accept: () => {
                api.delete(`/auctions/${auction.id}`)
                    .then(() => {
                        toast.success('Leilão excluído.');
                        fetchMyAuctions();
                    })
                    .catch(() => toast.error('Não foi possível excluir.'));
            }
        });
    };

    const statusBodyTemplate = (rowData) => {
        const severity = {
            'OPENED': 'success', 'CLOSED': 'danger', 'IN_REVIEW': 'warning', 'CANCELED': 'secondary'
        };
        const labels = {
            'OPENED': 'Aberto', 'CLOSED': 'Encerrado', 'IN_REVIEW': 'Em Análise', 'CANCELED': 'Cancelado'
        };
        return <Tag value={labels[rowData.status] || rowData.status} severity={severity[rowData.status]} />;
    };

    const priceBodyTemplate = (rowData) => {
        return rowData.minimumBid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const onPage = (event) => {
        setLazyParams(event);
    };

    if (!canManageAuctions) {
        return (
            <div className="flex flex-column align-items-center justify-content-center p-5">
                <i className="pi pi-tag text-6xl text-400 mb-3"></i>
                <h3 className="text-xl font-semibold mb-2">Nenhum leilão criado</h3>
                <p className="text-500 mb-4 text-center">
                    Você ainda não criou nenhum leilão. Comece agora e alcance milhares de compradores!
                </p>

                <Button label="Criar Primeiro Leilão" icon="pi pi-plus" onClick={handleBecomeSeller} />
            </div>
        );
    }

    return (
        <div className="mt-2">
            <ConfirmDialog />

            <List
                data={auctions}
                loading={loading}
                onNew={handleOpenModal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                filterFields={['title', 'description']}
                emptyMessage="Você ainda não possui leilões cadastrados."
                lazy={true}
                paginator={true}
                first={lazyParams.first}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                onPage={onPage}
                rowsPerPageOptions={[5, 10, 25]}
            >
                <Column field="id" header="ID" sortable style={{ width: '4rem' }} />
                <Column field="title" header="Título" sortable />
                <Column field="category.name" header="Categoria" sortable />
                <Column field="minimumBid" header="Valor Inicial" body={priceBodyTemplate} sortable style={{ width: '10rem' }} />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ width: '8rem' }} />
            </List>

            <AuctionForm
                visible={isDialogVisible}
                onHide={() => setIsDialogVisible(false)}
                onSave={handleSave}
                data={selectedAuction}
                isNew={isNew}
            />
        </div>
    );
};

export default UserAuctions;