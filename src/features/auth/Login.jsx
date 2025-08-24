import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { loginSchema } from '../../schemas';
import { AuthContext } from '../../contexts/AuthContext';

export default function Login() {
    const { login, token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            await login(data);

            if (token) {
                toast.success('Login realizado com sucesso!');
                navigate('/dashboard');
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <Card className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Fazer login</h1>
                    <p className="auth-subtitle">
                        Entre com suas credenciais
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="email">E-mail</label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="email"
                                    type="email"
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
                                    placeholder="Sua senha"
                                    toggleMask
                                    feedback={false}
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

                    <Button
                        type="submit"
                        label={loading ? 'Entrando...' : 'Entrar'}
                        loading={loading}
                        style={{ width: '100%' }}
                        icon="pi pi-sign-in"
                    />

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <span>Não tem uma conta? </span>
                        <Link to="/register" className="auth-link">
                            Criar conta
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
