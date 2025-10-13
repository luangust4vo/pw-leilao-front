import { useState, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { toast } from "react-toastify";
import api from "../../../../services/api";
import { useAuth } from "../../../../hooks/useAuth";

const PersonalInfo = ({ user }) => {
    const avatarInputRef = useRef(null);
    const [avatar, setAvatar] = useState(user?.profileImage || null);
    const [loading, setLoading] = useState(false);
    const { updateUser } = useAuth();

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);

        await uploadAvatar(file);
    };

    const uploadAvatar = async (file) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("userId", user.id);

            const res = await api.post(`storage/upload/avatar/${user.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.erro) throw new Error("Erro ao enviar imagem");

            const imageUrl = await res.data.dados;
            updateUser({ profileImage: imageUrl });
        } catch (err) {
            toast.error("Erro no upload:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-column gap-4">
            <div className="flex align-items-center gap-2">
                <div className="avatar-container relative" onClick={() => avatarInputRef.current.click()}>
                    <Avatar
                        image={avatar}
                        label={!avatar ? user?.name?.[0]?.toUpperCase() : null}
                        size="xlarge"
                        shape="circle"
                        className={`custom-avatar ${loading ? "opacity-50 grayscale" : ""
                            }`}
                    />
                    <div className="avatar-overlay flex align-items-center justify-content-center">
                        <i className="pi pi-plus text-white text-3xl"></i>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                <Divider layout="vertical" />

                <div className="grid flex-1">
                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="name" className="font-semibold">Nome Completo</label>
                            <InputText
                                id="name"
                                defaultValue={user?.name}
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="email" className="font-semibold">E-mail</label>
                            <InputText
                                id="email"
                                defaultValue={user?.email}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="phone" className="font-semibold">Telefone</label>
                            <InputText
                                id="phone"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="cpf" className="font-semibold">CPF</label>
                            <InputText
                                id="cpf"
                                placeholder="000.000.000-00"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined />
                <Button label="Salvar Alterações" icon="pi pi-check" />
            </div>
        </div>);
};

export default PersonalInfo;
