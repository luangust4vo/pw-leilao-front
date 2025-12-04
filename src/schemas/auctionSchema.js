import * as yup from 'yup';

export const auctionSchema = yup.object({
    title: yup.string().required('Título é obrigatório').max(200, 'Máximo de 200 caracteres'),
    description: yup.string().required('Descrição é obrigatória').max(500, 'Máximo de 500 caracteres'),
    detailedDescription: yup.string().max(2000, 'Máximo de 2000 caracteres'),
    startDateTime: yup.date().required('Data de início é obrigatória').nullable(),
    endDateTime: yup.date()
        .required('Data de fim é obrigatória')
        .min(yup.ref('startDateTime'), 'A data de fim deve ser posterior à data de início')
        .nullable(),
    incrementValue: yup.number()
        .required('Valor do incremento é obrigatório')
        .positive('Deve ser um valor positivo')
        .typeError('Deve ser um número'),
    minimumBid: yup.number()
        .required('Lance mínimo é obrigatório')
        .positive('Deve ser um valor positivo')
        .typeError('Deve ser um número'),
    categoryId: yup.number().required('Categoria é obrigatória'),
    imageUrls: yup.array().min(1, 'Adicione pelo menos uma imagem').required()
});