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
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
    });
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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSave = async () => {
        try {
            const res = await api.put(`/people/${user.id}`, formData);

            if (res.data.erro) throw new Error("Erro ao atualizar informações.");

            updateUser(res.data.dados);
            toast.success("Informações atualizadas com sucesso!");
            setIsEditing(false);
        } catch (err) {
            toast.error("Erro ao salvar alterações: ", err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user?.name || "",
        });
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
                    {!isEditing && (
                        <div className="col-12">
                            <p><strong>Nome:</strong> {formData.name || "—"}</p>
                        </div>
                    )}

                    {isEditing && (
                        <>
                            <div className="col-12 md:col-6">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="name" className="font-semibold">Nome Completo</label>
                                    <InputText
                                        id="name"
                                        defaultValue={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex justify-content-end gap-2">
                {!isEditing ? (
                    <Button label="Editar" icon="pi pi-pencil" onClick={() => setIsEditing(true)} />
                ) : (
                    <>
                        <Button
                            label="Cancelar"
                            severity="secondary"
                            outlined
                            onClick={handleCancel}
                            disabled={loading}
                        />
                        <Button
                            label="Salvar Alterações"
                            icon="pi pi-check"
                            onClick={handleSave}
                            loading={loading}
                        />
                    </>
                )}
            </div>
        </div>);
};

export default PersonalInfo;
