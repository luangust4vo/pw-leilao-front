import { Button } from "primereact/button";

const UserAuctions = () => {
    return (
        <div className="flex flex-column align-items-center justify-content-center p-5">
            <i className="pi pi-tag text-6xl text-400 mb-3"></i>
            <h3 className="text-xl font-semibold mb-2">Nenhum leilão criado</h3>
            <p className="text-500 mb-4 text-center">
                Você ainda não criou nenhum leilão. Comece agora e alcance milhares de compradores!
            </p>
            <Button label="Criar Primeiro Leilão" icon="pi pi-plus" />
        </div>
    );
};

export default UserAuctions;