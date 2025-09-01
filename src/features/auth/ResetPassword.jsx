import { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AuthContext } from '../../contexts/AuthContext';
import { resetPasswordSchema } from '../../schemas/authSchemas';

const ResetPassword = () => {
    const { resetPassword } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' }
    });

    const onSubmit = async (data) => {
        const code = searchParams.get('code');
        if (!code) {
            toast.error("Código de verificação inválido. Por favor, tente novamente.");
            navigate('/forgot-password');
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ code, newPassword: data.password });
            toast.success("Senha alterada com sucesso! Você já pode fazer o login.");
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error("Falha ao redefinir a senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <Card className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Crie sua Nova Senha</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="password">Nova Senha</label>
                        <Controller name="password" control={control} render={({ field }) => (
                            <Password {...field} id="password" toggleMask feedback={true} className={errors.password ? 'p-invalid' : ''} />
                        )} />
                        {errors.password && <small className="p-error">{errors.password.message}</small>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                        <Controller name="confirmPassword" control={control} render={({ field }) => (
                            <Password {...field} id="confirmPassword" toggleMask feedback={false} className={errors.confirmPassword ? 'p-invalid' : ''} />
                        )} />
                        {errors.confirmPassword && <small className="p-error">{errors.confirmPassword.message}</small>}
                    </div>
                    <Button type="submit" label={loading ? 'Salvando...' : 'Salvar Nova Senha'} loading={loading} style={{ width: '100%' }} />
                </form>
            </Card>
        </div>
    );
}

export default ResetPassword;