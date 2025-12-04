import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { toast } from 'react-toastify';

import { auctionSchema } from '../../../../schemas';
import { EntityModal } from '../../../../components';
import api from '../../../../services/api';

const AuctionForm = ({ visible, onHide, onSave, data, isNew }) => {
    const [categories, setCategories] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(auctionSchema),
        defaultValues: {
            title: '',
            description: '',
            detailedDescription: '',
            startDateTime: null,
            endDateTime: null,
            incrementValue: null,
            minimumBid: null,
            categoryId: null,
            observation: '',
            imageUrls: []
        }
    });

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.dados.content));
    }, []);

    useEffect(() => {
        if (data && !isNew) {
            Object.keys(data).forEach(key => {
                if (key.includes('Date')) {
                    setValue(key, new Date(data[key]));
                } else if (key === 'category') {
                    setValue('categoryId', data.category.id);
                } else if (key === 'images') {
                    const urls = data.images?.map(img => img.url) || [];
                    setUploadedImages(urls);
                    setValue('imageUrls', urls);
                } else {
                    setValue(key, data[key]);
                }
            });
        } else {
            reset();
            setUploadedImages([]);
        }
    }, [data, isNew, reset, setValue]);

    const handleUpload = async (event) => {
        setIsUploading(true);

        const files = event.files;
        const urls = [];

        try {
            const promises = files.map(file => {
                const formData = new FormData();
                formData.append('file', file);

                return api.post('/storage/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            });

            const responses = await Promise.all(promises);

            responses.forEach(response => {
                urls.push(response.data.dados);
            });

            const updatedImages = [...uploadedImages, ...urls];
            setUploadedImages(updatedImages);
            setValue('imageUrls', updatedImages);
        } catch (error) {
            console.error('Erro: ' + error);
            toast.error('Erro ao enviar imagem.');
        } finally {
            event.options.clear();
            setIsUploading(false);
        }
    };

    const removeImage = (indexToRemove) => {
        const newImages = uploadedImages.filter((_, index) => index !== indexToRemove);
        setUploadedImages(newImages);
        setValue('imageUrls', newImages);
    };

    const onSubmit = (formData) => {
        onSave(formData);
    };

    return (
        <EntityModal
            name="Leilão"
            visible={visible}
            onHide={onHide}
            onSave={handleSubmit(onSubmit)}
            isNew={isNew}
            data={data}
            newData={{}}
            setNewData={() => { }}
            style={{ width: '80vw' }}
        >
            <form className="p-fluid formgrid grid">
                <div className="field col-12">
                    <label htmlFor="title">Título</label>
                    <Controller name="title" control={control} render={({ field }) => (
                        <InputText {...field} className={errors.title ? 'p-invalid' : ''} autoFocus />
                    )} />
                    {errors.title && <small className="p-error">{errors.title.message}</small>}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="categoryId">Categoria</label>
                    <Controller name="categoryId" control={control} render={({ field }) => (
                        <Dropdown {...field} options={categories} optionLabel="name" optionValue="id" placeholder="Selecione..." className={errors.categoryId ? 'p-invalid' : ''} />
                    )} />
                    {errors.categoryId && <small className="p-error">{errors.categoryId.message}</small>}
                </div>

                <div className="field col-12 md:col-3">
                    <label htmlFor="minimumBid">Lance Mínimo (R$)</label>
                    <Controller name="minimumBid" control={control} render={({ field }) => (
                        <InputNumber
                            id={field.name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                            className={errors.minimumBid ? 'p-invalid' : ''}
                        />
                    )} />
                    {errors.minimumBid && <small className="p-error">{errors.minimumBid.message}</small>}
                </div>
                <div className="field col-12 md:col-3">
                    <label htmlFor="incrementValue">Incremento (R$)</label>
                    <Controller name="incrementValue" control={control} render={({ field }) => (
                        <InputNumber
                            id={field.name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                            className={errors.incrementValue ? 'p-invalid' : ''}
                        />
                    )} />
                    {errors.incrementValue && <small className="p-error">{errors.incrementValue.message}</small>}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="startDateTime">Início</label>
                    <Controller name="startDateTime" control={control} render={({ field }) => (
                        <Calendar {...field} showTime hourFormat="24" showIcon className={errors.startDateTime ? 'p-invalid' : ''} />
                    )} />
                    {errors.startDateTime && <small className="p-error">{errors.startDateTime.message}</small>}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="endDateTime">Fim</label>
                    <Controller name="endDateTime" control={control} render={({ field }) => (
                        <Calendar {...field} showTime hourFormat="24" showIcon className={errors.endDateTime ? 'p-invalid' : ''} />
                    )} />
                    {errors.endDateTime && <small className="p-error">{errors.endDateTime.message}</small>}
                </div>

                <div className="field col-12">
                    <label htmlFor="description">Descrição Curta</label>
                    <Controller name="description" control={control} render={({ field }) => (
                        <InputTextarea {...field} rows={2} className={errors.description ? 'p-invalid' : ''} />
                    )} />
                    {errors.description && <small className="p-error">{errors.description.message}</small>}
                </div>

                <div className="field col-12">
                    <label htmlFor="detailedDescription">Descrição Detalhada</label>
                    <Controller name="detailedDescription" control={control} render={({ field }) => (
                        <InputTextarea {...field} rows={4} className={errors.detailedDescription ? 'p-invalid' : ''} />
                    )} />
                </div>

                <div className="field col-12">
                    <label>Imagens do Produto</label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {uploadedImages.map((url, index) => (
                            <div key={index} className="relative">
                                <Image src={url} alt="Uploaded" width="80" preview />
                                <Button
                                    icon="pi pi-times"
                                    className="p-button-rounded p-button-danger p-button-xs absolute -top-2 -right-2"
                                    style={{ width: '1.5rem', height: '1.5rem' }}
                                    onClick={() => removeImage(index)}
                                    type="button"
                                />
                            </div>
                        ))}
                    </div>
                    <FileUpload
                        mode="basic"
                        auto
                        customUpload
                        multiple
                        uploadHandler={handleUpload}
                        accept="image/*"
                        maxFileSize={1000000}
                        chooseLabel={isUploading ? "Enviando..." : "Adicionar Imagem"}
                        disabled={isUploading}
                    />

                    {errors.imageUrls && <small className="p-error block mt-2">{errors.imageUrls.message}</small>}
                </div>
            </form>
        </EntityModal>
    );
};

export default AuctionForm;