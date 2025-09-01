import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup
        .string()
        .required('Email é obrigatório')
        .email('Email inválido'),
    password: yup
        .string()
        .required('Senha é obrigatória')
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export const registerSchema = yup.object({
    name: yup
        .string()
        .required('Nome é obrigatório')
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: yup
        .string()
        .required('Email é obrigatório')
        .email('Email inválido'),
    password: yup
        .string()
        .required('Senha é obrigatória')
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(50, 'Senha deve ter no máximo 50 caracteres'),
    confirmPassword: yup
        .string()
        .required('Confirmação de senha é obrigatória')
        .oneOf([yup.ref('password')], 'As senhas não coincidem')
});

export const forgotPasswordSchema = yup.object({
    email: yup
        .string()
        .required('Email é obrigatório')
        .email('Email inválido'),
});

export const resetPasswordSchema = yup.object({
    password: yup
        .string()
        .required('Senha é obrigatória')
        .min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: yup
        .string()
        .required('Confirmação de senha é obrigatória')
        .oneOf([yup.ref('password')], 'As senhas não coincidem')
});
