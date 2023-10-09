export const handleMethodNotAllowed = (req, res) => {
    res.status(405).send('Method Not Allowed');
};
