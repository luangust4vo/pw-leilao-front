import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const List = ({ data, loading, onNew, onEdit, onDelete, filterFields, children }) => {
    const [globalFilter, setGlobalFilter] = useState(null);

    const header = () => {
        return (
            <div className="flex gap-2 justify-content-end align-items-center">
                <div className='relative'>
                    <i className="pi pi-search absolute top-50 -mt-2 px-2 text-gray-400" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Pesquisar..."
                        className='px-5'
                    />
                </div>
                <Button
                    label="Novo"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={onNew}
                />
            </div>
        );
    };

    const body = (rowData) => (
        <div className="flex justify-content-end gap-2">
            <Button icon="pi pi-pencil" rounded onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" rounded severity="danger" onClick={() => onDelete(rowData)} />
        </div>
    );

    return (
        <DataTable
            value={data}
            loading={loading}
            dataKey="id"
            rowHover={true}
            size='small'
            paginator rows={10}
            header={header}
            globalFilter={globalFilter}
            globalFilterFields={filterFields}
            emptyMessage="Não tem nada aqui ;-;"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
        >
            {children}
            <Column body={body} exportable={false} style={{ minWidth: '12rem' }} />
        </DataTable>
    );
};

export default List;