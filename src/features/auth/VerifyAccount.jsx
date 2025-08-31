import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';

const VerifyAccount = () => {
    const navigate = useNavigate();
    const { verify, status } = useContext(AuthContext);

    useEffect(() => {
        const response = verify();

        if (response instanceof Promise) {
            response.then((message) => {
                if (status === 'success') {
                    toast.success(message);
                    navigate('/dashboard');
                } else if (status === 'error') {
                    toast.error(message);
                    navigate('/login');
                }
            });
        }
    }, [navigate, status, verify]);

    return (
        <div className="auth-layout">
            <div className="flex flex-column align-items-center gap-3">
                {status === 'verifying' && (
                    <>
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" />
                        <p className="auth-subtitle">Verificando sua conta...</p>
                    </>
                )}
                {status === 'error' && (
                    <p className="auth-subtitle p-error">Houve um erro ao verificar sua conta. Tente novamente.</p>
                )}
            </div>
        </div>
    );
};

export default VerifyAccount;