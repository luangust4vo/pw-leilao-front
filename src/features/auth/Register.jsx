import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { registerSchema } from '../../schemas/authSchemas';
import { AuthContext } from '../../contexts/AuthContext';

export default function Register() {
    const { register, token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await register(data);

            if (token) {
                toast.success('Conta criada com sucesso!');
                navigate('/dashboard');
                return;
            }
        } catch (error) {
            toast.error(error.message || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <Card className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Criar conta</h1>
                    <p className="auth-subtitle">
                        Preencha os dados para criar sua conta
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="name">Nome</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="name"
                                    placeholder="Seu nome completo"
                                    className={errors.name ? 'p-invalid' : ''}
                                />
                            )}
                        />
                        {errors.name && (
                            <small className="p-error">{errors.name.message}</small>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">E-mail</label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="email"
                                    placeholder="Seu e-mail"
                                    className={errors.email ? 'p-invalid' : ''}
                                />
                            )}
                        />
                        {errors.email && (
                            <small className="p-error">{errors.email.message}</small>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Senha</label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Password
                                    {...field}
                                    id="password"
                                    placeholder="Crie uma senha"
                                    toggleMask
                                    feedback={true}
                                    className={errors.password ? 'p-invalid' : ''}
                                    style={{ width: '100%' }}
                                    inputStyle={{ width: '100%' }}
                                    pt={{
                                        root: { style: { width: '100%' } },
                                        input: { style: { width: '100%' } }
                                    }}
                                />
                            )}
                        />
                        {errors.password && (
                            <small className="p-error">{errors.password.message}</small>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="confirmPassword">Confirmar senha</label>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <Password
                                    {...field}
                                    id="confirmPassword"
                                    placeholder="Confirme sua senha"
                                    toggleMask
                                    feedback={false}
                                    className={errors.confirmPassword ? 'p-invalid' : ''}
                                    style={{ width: '100%' }}
                                    inputStyle={{ width: '100%' }}
                                    pt={{
                                        root: { style: { width: '100%' } },
                                        input: { style: { width: '100%' } }
                                    }}
                                />
                            )}
                        />
                        {errors.confirmPassword && (
                            <small className="p-error">{errors.confirmPassword.message}</small>
                        )}
                    </div>

                    <Button
                        type="submit"
                        label={loading ? 'Criando conta...' : 'Criar conta'}
                        loading={loading}
                        style={{ width: '100%' }}
                        icon="pi pi-user-plus"
                    />

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <span>Já tem uma conta? </span>
                        <Link to="/" className="auth-link">
                            Fazer login
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
