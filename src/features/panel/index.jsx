import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const Panel = () => {
    const adminPanels = [
        {
            key: 'categories',
            title: 'Gerenciar Categorias',
            description: 'Adicionar, editar ou remover categorias de leilão.',
            icon: 'pi pi-tags',
            path: '/categories'
        },
        {
            key: 'profiles',
            title: 'Gerenciar Perfis',
            description: 'Visualizar e gerenciar os tipos de perfil do sistema.',
            icon: 'pi pi-users',
            path: '/profiles'
        },
        {
            key: 'users',
            title: 'Gerenciar Usuários',
            description: 'Visualizar, ativar ou desativar contas de usuários.',
            icon: 'pi pi-user-edit',
            path: '/users'
        }
    ];

    const createCardFooter = (path) => (
        <Button
            label="Acessar Painel"
            icon="pi pi-arrow-right"
            className="w-full"
            onClick={() => window.open(path)}
        />
    );

    return (
        <div className="p-4 md:p-5">
            <h2 className="text-3xl font-bold mb-4">Painel Administrativo</h2>
            <p className="text-lg text-600 mb-5">Selecione uma seção para gerenciar.</p>

            <div className="grid">
                {adminPanels.map((panel) => (
                    <div key={panel.key} className="col-12 md:col-6 lg:col-4">
                        <Card
                            title={panel.title}
                            subTitle={panel.description}
                            footer={() => createCardFooter(panel.path)}
                            className="shadow-2 h-full mb-2"
                            header={<i className={`${panel.icon} text-5xl text-primary p-4`}></i>}
                        >
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Panel;