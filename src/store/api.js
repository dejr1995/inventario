//export const url = 'https://ecommerce.devernlei.com:3001/api';
export const url = 'http://localhost:9000/api';

export const setHeaders = () => {
    const headers = {
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
    };

    return headers;
}