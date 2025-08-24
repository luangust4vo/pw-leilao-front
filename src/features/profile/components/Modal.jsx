import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const Modal = ({ visible, onHide, onSave, profile, isNew }) => {
    const [profileData, setProfileData] = useState({ type: '' });

    useEffect(() => {
        if (profile) {
            setProfileData({ ...profile });
        }
    }, [profile]);

    const handleSaveClick = () => {
        if (profileData.type.trim()) {
            onSave(profileData);
        }
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
            header={isNew ? 'Novo Perfil' : 'Editar Perfil'}
            modal
            onHide={onHide}
            footer={dialogFooter}
            className="p-fluid"
            style={{ width: '32rem' }}
        >
            <div className="field">
                <label htmlFor="type">Nome do Perfil</label>
                <InputText
                    id="type"
                    value={profileData.type}
                    onChange={(e) => setProfileData({ ...profileData, type: e.target.value })}
                    placeholder="Ex: MODERATOR (sem ROLE_)"
                    autoFocus
                />
            </div>
        </Dialog>
    );
};

export default Modal;