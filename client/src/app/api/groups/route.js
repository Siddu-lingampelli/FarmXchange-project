export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Group API' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
