import { useRef } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import './navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const profileMenu = useRef(null);

    const handleLogout = () => {
        logout();

        if (!user) {
            navigate('/login');
        }
    };

    const profileMenuItems = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            url: '/user/',
        },
        {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: handleLogout,
            className: "logout-item",
        }
    ];

    const startContent = <h2 className="m-0">Leilão</h2>;

    const endContent = (
        <div className="flex align-items-center gap-3">
            <Avatar
                image={user?.profileImage || null}
                label={!user?.profileImage ? (user?.name?.[0] || user?.email?.[0])?.toUpperCase() : null}
                shape="circle"
                size="large"
                onClick={(event) => profileMenu.current.toggle(event)}
                aria-controls="profile_menu"
                aria-haspopup
                className="cursor-pointer"
            />
        </div>
    );

    return (
        <>
            <Menu
                model={profileMenuItems}
                popup
                ref={profileMenu}
                id="profile_menu"
                popupAlignment="right"
            />
            <Toolbar start={startContent} end={endContent} className="border-noround p-3" />
        </>
    );
};

export default Navbar;