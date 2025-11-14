export const checkAuth = async () : Promise<boolean> => {
    const res = await fetch('http://localhost:3000/api/auth/check', {
        method: 'GET',
        credentials: 'include'
    });
    return res.ok;
}