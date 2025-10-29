import { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { AuthContext } from '../../../../contexts/AuthContext';
import { toast } from "react-toastify";
import api from "../../../../services/api";

const AccountSettings = () => {
    const { logout } = useContext(AuthContext);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        newPassword: '',
        confirmPassword: ''
    });

    const passwordFields = [
        { id: 'current', label: 'Senha Atual', type: 'password' },
        { id: 'newPassword', label: 'Nova Senha', type: 'password' },
        { id: 'confirmPassword', label: 'Confirmar Nova Senha', type: 'password' }
    ];

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswords(prev => ({ ...prev, [id]: value }));
    };

    const handlePasswordSubmit = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('A nova senha e a confirmação não conferem.');
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setPasswordLoading(true);
        try {
            await api.post('/people/me/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.newPassword
            });

            toast.success('Senha alterada com sucesso!');
            setPasswords({ current: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err)
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await api.delete('/people/me');

            toast.success('Conta desativada com sucesso!');

            setTimeout(() => {
                logout();
            }, 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const confirmDeleteAccount = () => {
        confirmDialog({
            message: 'Você tem certeza que deseja desativar sua conta?',
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim, excluir minha conta',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: handleDeleteAccount,
            reject: () => { setDeleteLoading(false); }
        });
    };

    return (
        <div className="flex flex-column gap-4">
            <ConfirmDialog />

            <Card className="surface-50 border-1 border-200">
                <h3 className="text-lg font-semibold mb-3 flex align-items-center gap-2">
                    <i className="pi pi-shield text-blue-500"></i>
                    Segurança
                </h3>

                <div className="flex flex-column gap-3">
                    {passwordFields.map((field) => (
                        <div key={field.id} className="flex flex-column gap-2">
                            <label htmlFor={field.id} className="font-semibold">
                                {field.label}
                            </label>
                            <InputText
                                id={field.id}
                                type={field.type}
                                value={passwords[field.id]}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    ))}

                    <Button
                        label="Alterar Senha"
                        icon="pi pi-key"
                        className="w-auto align-self-start"
                        onClick={handlePasswordSubmit}
                        loading={passwordLoading}
                    />
                </div>
            </Card>

            <Card className="surface-red-50 border-1 border-red-200">
                <h3 className="text-lg font-semibold mb-3 text-red-600 flex align-items-center gap-2">
                    <i className="pi pi-exclamation-triangle"></i>
                    Zona de Perigo
                </h3>
                <p className="text-sm text-600 mb-3">
                    Uma vez que você excluir sua conta, não há como voltar atrás. Por favor, tenha certeza.
                </p>
                <Button
                    label="Excluir Conta"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    size="small"
                    onClick={confirmDeleteAccount}
                    loading={deleteLoading}
                />
            </Card>
        </div>
    );
};

export default AccountSettings;