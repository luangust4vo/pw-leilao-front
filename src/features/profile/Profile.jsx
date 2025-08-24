import { useState, useEffect } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { List, Modal } from './components';
import { toast } from 'react-toastify';
import api from '../../services/api';

const Profile = () => {
    const [profiles, setProfiles] = useState([]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = () => {
        setLoading(true);
        api.get('/profiles').then(response => {
            setProfiles(response.data.content);
        }).catch(error => {
            toast.error('Erro ao buscar perfis');
            setProfiles([]);
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleOpenModal = () => {
        setSelectedProfile({ type: '' });
        setIsNew(true);
        setIsDialogVisible(true);
    };

    const handleCloseModal = () => {
        setIsDialogVisible(false);
    };

    const handleSave = (profileData) => {
        const url = isNew ? '/profiles' : `/profiles/${profileData.id}`;
        const method = isNew ? 'post' : 'put';
        const action = isNew ? 'criado' : 'atualizado';

        const dataToSend = { ...profileData, type: `ROLE_${profileData.type.toUpperCase()}` };

        api[method](url, dataToSend)
            .then(() => {
                toast.success(`Perfil ${action} com sucesso.`);
                handleCloseModal();
                fetchProfiles();
            })
            .catch(error => {
                const message = error.response?.data?.message || `Falha ao salvar perfil`;
                toast.error(message);
            });
    };

    const handleEdit = (profile) => {
        setSelectedProfile({ ...profile, type: profile.type.replace('ROLE_', '') });
        setIsNew(false);
        setIsDialogVisible(true);
    };

    const handleDelete = (profile) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir o perfil "${profile.type}"?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            className: 'delete-profile-dialog',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            accept: () => {
                api.delete(`/profiles/${profile.id}`)
                    .then(() => {
                        toast.success('Perfil excluído com sucesso.');
                        fetchProfiles();
                    })
                    .catch(error => {
                        const message = error.response?.data?.message || 'Falha ao deletar perfil';
                        toast.error(message);
                    });
            }
        });
    };

    return (
        <div className="card m-4">
            <ConfirmDialog />

            <div className="mb-4">
                <h1 className="text-2xl font-bold">Gerenciamento de Perfis</h1>
            </div>

            <List
                profiles={profiles}
                loading={loading}
                onNew={handleOpenModal}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <Modal
                visible={isDialogVisible}
                onHide={handleCloseModal}
                onSave={handleSave}
                profile={selectedProfile}
                isNew={isNew}
            />
        </div>
    );
};

export default Profile;