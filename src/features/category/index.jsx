import { useState, useEffect } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import { List, EntityModal, Modal } from '../../components';
import api from '../../services/api';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', observation: '' });
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedCategoryForView, setSelectedCategoryForView] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        api.get('/categories').then(response => {
            setCategories(response.data.dados.content);
        }).catch(error => {
            toast.error('Erro ao buscar perfis');
            setCategories([]);
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleOpenModal = () => {
        setSelectedCategory({ name: '', observation: '' });
        setIsNew(true);
        setIsDialogVisible(true);
    };

    const handleCloseModal = () => {
        setIsDialogVisible(false);
    };

    const handleViewDetails = (category) => {
        setSelectedCategoryForView(category);
        setIsViewModalVisible(true);
    };

    const handleSave = (categoryData) => {
        if (!categoryData.name && categoryData.name.trim() == '') {
            toast.error('O nome da categoria é obrigatório.');
            return;
        }

        const url = isNew ? '/categories' : `/categories/${categoryData.id}`;
        const method = isNew ? 'post' : 'put';
        const action = isNew ? 'criado' : 'atualizado';

        const dataToSend = { ...categoryData, name: categoryData.name, observation: categoryData.observation };

        api[method](url, dataToSend)
            .then(() => {
                toast.success(`Categoria ${action} com sucesso.`);
                handleCloseModal();
                fetchCategories();
            })
            .catch(error => {
                const message = error.response?.data?.message || `Falha ao salvar categoria`;
                toast.error(message);
            });
    };

    const handleEdit = (category) => {
        setSelectedCategory({ ...category, name: category.name, observation: category.observation });
        setIsNew(false);
        setIsDialogVisible(true);
    };

    const handleDelete = (category) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir a categoria "${category.name}"?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            className: 'delete-category-dialog',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            accept: () => {
                api.delete(`/categories/${category.id}`)
                    .then(() => {
                        toast.success('Categoria excluída com sucesso.');
                        fetchCategories();
                    })
                    .catch(error => {
                        const message = error.response?.data?.message || 'Falha ao excluir categoria';
                        toast.error(message);
                    });
            }
        });
    };

    return (
        <div className="card m-4">
            <ConfirmDialog />

            <div className="mb-4">
                <h1 className="text-2xl font-bold">Gerenciamento de Categorias</h1>
            </div>

            <List
                data={categories}
                loading={loading}
                onNew={handleOpenModal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                filterFields={['id', 'name']}
                onRowClick={handleViewDetails}
            >
                <Column field="id" header="ID" sortable />
                <Column field="name" header="Nome" sortable />
            </List>
            <EntityModal
                name="Categoria"
                visible={isDialogVisible}
                onHide={handleCloseModal}
                onSave={handleSave}
                data={selectedCategory}
                newData={newCategory}
                setNewData={setNewCategory}
                isNew={isNew}
            >
                <div className="flex flex-column gap-2">
                    <div className="field">
                        <label htmlFor="name">Nome da Categoria</label>
                        <InputText
                            id="name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="Ex: Eletrônicos, Casa, Roupas, etc."
                            autoFocus
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="observation">Observação</label>
                        <InputText
                            id="observation"
                            value={newCategory.observation}
                            onChange={(e) => setNewCategory({ ...newCategory, observation: e.target.value })}
                            placeholder="Ex: Dispositivos eletrônicos, móveis para casa, vestuário, etc."
                            autoFocus
                        />
                    </div>
                </div>
            </EntityModal>

            <Modal
                header="Detalhes da Categoria"
                visible={isViewModalVisible}
                onHide={() => setIsViewModalVisible(false)}
            >
                {selectedCategoryForView && (
                    <div className="flex flex-column gap-3">
                        <div>
                            <span className="font-bold">Nome: </span>
                            <span>{selectedCategoryForView.name}</span>
                        </div>
                        <div>
                            <span className="font-bold">Observação: </span>
                            <span>{selectedCategoryForView.observation || 'Nenhuma observação.'}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Category;