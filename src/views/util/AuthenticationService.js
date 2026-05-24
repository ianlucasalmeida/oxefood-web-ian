import axios from 'axios';

export const TOKEN_SESSION_ATTRIBUTE_NAME = 'token';
export const EXPIRATION_SESSION_ATTRIBUTE_NAME = 'expiration';

export const registerSuccessfulLoginForJwt = (token, expiration) => {
    localStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, token);
    localStorage.setItem(EXPIRATION_SESSION_ATTRIBUTE_NAME, expiration);
    setupAxiosInterceptors();
}

export const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    // Redireciona para a raiz (Login) após deslogar
    window.location.href = '/'; 
}

export const isTokenExpired = () => {
    let expiration = localStorage.getItem(EXPIRATION_SESSION_ATTRIBUTE_NAME);
    return expiration === null || expiration < new Date().getTime();
}

export const isUserLoggedIn = () => {
    let user = localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);
    return user !== null;
}

export const getToken = () => {
    let token = localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);
    return token === null ? '' : token;
}

export const createJWTToken = (token) => {
    return 'Bearer ' + token;
}

export const setupAxiosInterceptors = () => {
    // 1. Interceptador de IDA: Injeta o Token no cabeçalho das requisições
    let token = createJWTToken(getToken());
    if (isUserLoggedIn()) {
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    // 2. Interceptador de VOLTA: Monitora erros 401/403 (Token Vencido)
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // Se o servidor retornar 401 ou 403, o token provavelmente está inválido/expirado
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.warn("Sessão expirada. Realizando logout automático.");
                logout(); 
            }
            return Promise.reject(error);
        }
    );
}