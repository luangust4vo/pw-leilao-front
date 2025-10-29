import { Button } from "primereact/button";

const UserBids = () => {
    return (
        <div className="flex flex-column align-items-center justify-content-center p-5">
            <i className="pi pi-bolt text-6xl text-400 mb-3"></i>
            <h3 className="text-xl font-semibold mb-2">Nenhum lance realizado</h3>
            <p className="text-500 mb-4 text-center">
                Você ainda não participou de nenhum leilão. Explore os leilões ativos!
            </p>
            <Button label="Ver Leilões Ativos" icon="pi pi-search" outlined />
        </div>
    );
};

export default UserBids;