import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useAuth } from '../../hooks/useAuth';

const SessionTimeoutModal = () => {
    const { isSessionModalVisible, tokenExpirationDate, refreshToken, logout } = useAuth();
    const [countdown, setCountdown] = useState(120);

    useEffect(() => {
        if (!isSessionModalVisible || !tokenExpirationDate) {
            return;
        }

        const interval = setInterval(() => {
            const remainingTime = Math.round(
                (tokenExpirationDate.getTime() - new Date().getTime()) / 1000
            );
            setCountdown(remainingTime > 0 ? remainingTime : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [isSessionModalVisible, tokenExpirationDate]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const footerContent = (
        <div>
            <Button label="Não" icon="pi pi-sign-out" onClick={logout} severity='danger' />
            <Button label="Sim" icon="pi pi-refresh" onClick={refreshToken} />
        </div>
    );

    return (
        <Dialog
            header="Sua sessão está prestes a expirar"
            visible={isSessionModalVisible}
            style={{ width: '30rem' }}
            onHide={() => { }}
            closable={false}
            footer={footerContent}
            modal
            pt={{
                header: {
                    className: 'text-center'
                },
                footer: {
                    className: 'flex justify-content-center'
                }
            }}
        >
            <div className="flex flex-column align-items-center text-center gap-4">
                <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--yellow-500)' }}></i>
                <p className='m-0'>
                    Para sua segurança, sua sessão será encerrada em{'  '}
                    <strong style={{ color: 'black' }}>{formatTime(countdown)}</strong>.
                </p>
                <p className='m-0'>Deseja continuar?</p>
            </div>
        </Dialog >
    );
};

export default SessionTimeoutModal;