import { useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Badge } from 'primereact/badge';
import { useAuth } from '../../../hooks/useAuth';

import { PersonalInfo, UserAuctions, UserBids, AccountSettings } from './components'

import '../person.css';

const UserProfile = () => {
    const { user } = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="profile-container p-4">
            <div className="grid">
                <div className="col-12">
                    <Card className="m-0">
                        <div className="flex align-items-center gap-4 flex-wrap">
                            <Avatar
                                image={user?.profileImage || null}
                                label={!user?.profileImage ? (user?.name?.[0] || user?.email?.[0])?.toUpperCase() : null}
                                size="xlarge"
                                shape="circle"
                                style={{ width: '70px', height: '70px', fontSize: '2.5rem' }}
                            />

                            <div className="flex-1">
                                <div className="flex align-items-center gap-2 mb-1 flex-wrap">
                                    <h2 className="text-base font-bold m-0">{user?.name || 'Usuário'} |</h2>
                                    <div className="flex gap-2 flex-wrap">
                                        {user?.profiles?.map((profile, index) => (
                                            <Badge
                                                key={index}
                                                value={profile.type.replace('ROLE_', '')}
                                                severity="info"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-500 m-0 mb-2">{user?.email}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12">
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header="Informações Pessoais" leftIcon="pi pi-user mr-2">
                            <PersonalInfo user={user} />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;