import { useState, useEffect } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import { List, EntityModal } from '../../components';
import api from '../../services/api';

const Profile = () => {
    const [profiles, setProfiles] = useState([]);
    const [newProfile, setNewProfile] = useState({ type: '' });
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
        if (!profileData.type && profileData.type.trim() == '') {
            toast.error('O campo Tipo do Perfil é obrigatório.');
            return;
        }

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
                data={profiles}
                loading={loading}
                onNew={handleOpenModal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                filterFields={['id', 'type']}
            >
                <Column field="id" header="ID" sortable />
                <Column field="type" header="Tipo" sortable />
            </List>
            <EntityModal
                name="Perfil"
                visible={isDialogVisible}
                onHide={handleCloseModal}
                onSave={handleSave}
                data={selectedProfile}
                newData={newProfile}
                setNewData={setNewProfile}
                isNew={isNew}
            >
                <label htmlFor="type">Nome do Perfil</label>
                <InputText
                    id="type"
                    value={newProfile.type}
                    onChange={(e) => setNewProfile({ ...newProfile, type: e.target.value })}
                    placeholder="Ex: MODERATOR (sem ROLE_)"
                    autoFocus
                />
            </EntityModal>
        </div>
    );
};

export default Profile;