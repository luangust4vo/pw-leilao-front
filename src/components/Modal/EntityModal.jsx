import { useEffect } from 'react';
import { Button } from 'primereact/button';
import Modal from './Modal';

const EntityModal = ({ name, visible, onHide, onSave, data, newData, setNewData, isNew, children }) => {
    useEffect(() => {
        if (data) {
            setNewData({ ...data });
        }
    }, [data, setNewData]);

    const handleSaveClick = () => {
        onSave(newData);
    };

    const dialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} severity='danger' />
            <Button label="Salvar" icon="pi pi-check" onClick={handleSaveClick} />
        </div>
    );

    return (
        <Modal
            header={isNew ? `Novo ${name}` : `Editar ${name}`}
            visible={visible}
            onHide={onHide}
            footer={dialogFooter}
        >
            {children}
        </Modal>
    );
};

export default EntityModal;