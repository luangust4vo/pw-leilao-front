import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AuthContext } from '../../contexts/AuthContext';
import { forgotPasswordSchema } from '../../schemas/authSchemas';

const ForgotPassword = () => {
    const { requestPasswordReset } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: { email: '' }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await requestPasswordReset(data.email);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            toast.error("Falha ao enviar o e-mail de redefinição.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <Card className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Redefinir Senha</h1>
                    <p className="auth-subtitle">
                        {submitted
                            ? "Se o e-mail estiver cadastrado, um link foi enviado para você."
                            : "Digite seu e-mail para receber o link de redefinição."
                        }
                    </p>
                </div>

                {!submitted && (
                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                        <div className="form-field">
                            <label htmlFor="email">E-mail</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <InputText {...field} id="email" type="email" placeholder="Seu e-mail" className={errors.email ? 'p-invalid' : ''} />
                                )}
                            />
                            {errors.email && <small className="p-error">{errors.email.message}</small>}
                        </div>

                        <Button type="submit" label={loading ? 'Enviando...' : 'Enviar Link'} loading={loading} style={{ width: '100%' }} />
                    </form>
                )}
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link to="/login" className="auth-link">
                        Voltar para o Login
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;