const BASE_URL = 'http://localhost:5000/api/transactions';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const getAllTransactions = async () => {
    const res = await fetch(BASE_URL, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
};

export const getTransactionById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch transaction');
    return res.json();
};

export const createTransaction = async (data) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
};

export const updateTransaction = async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return res.json();
};

export const deleteTransaction = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
    return res.json();
};

export const searchGps = async (keyword) => {
    const res = await fetch(`http://localhost:5000/api/gp/search?q=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to search GPs');
    return res.json();
};

export const getGpById = async (id) => {
    const res = await fetch(`http://localhost:5000/api/gp/${id}`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch GP');
    return res.json();
};

export const getDepartments = async () => {
    const res = await fetch(`http://localhost:5000/api/departments`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
};

export const getWorks = async () => {
    const res = await fetch(`http://localhost:5000/api/works`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch works');
    return res.json();
};
