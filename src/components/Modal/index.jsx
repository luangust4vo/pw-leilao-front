import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const Modal = ({ name, visible, onHide, onSave, data, newData, setNewData, isNew, children }) => {
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
        <Dialog
            visible={visible}
            header={isNew ? `Novo ${name}` : `Editar ${name}`}
            modal
            onHide={onHide}
            footer={dialogFooter}
            className="p-fluid"
            style={{ width: '32rem' }}
        >
            <div className="field">
                {children}
            </div>
        </Dialog>
    );
};

export default Modal;