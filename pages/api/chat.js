export default function handler(req, res) {
  res.status(200).json({
    message: "Olá! Esta é a rota /api/chat.",
    method: req.method,
  });
}
