import { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';

const VerifyResetCode = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyResetCode } = useContext(AuthContext);

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            toast.error("Código inválido.");
            navigate('/forgot-password');
            return;
        }

        const verify = async () => {
            try {
                await verifyResetCode(code);
                navigate(`/reset-password?code=${code}`);
            } catch (error) {
                console.error(error);
                navigate('/forgot-password');
            }
        };

        verify();
    }, [searchParams, navigate, verifyResetCode]);

    return (
        <div className="auth-layout">
            <div className="flex flex-column align-items-center gap-3">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" />
                <p className="auth-subtitle">Verificando código...</p>
            </div>
        </div>
    );
}

export default VerifyResetCode;