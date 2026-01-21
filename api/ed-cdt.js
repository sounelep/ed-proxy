import cors from "./cors.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { token, idEleve, dateDebut, dateFin } = req.body;

    if (!token || !idEleve || !dateDebut || !dateFin) {
      return res.status(400).json({ error: "token, idEleve, dateDebut et dateFin sont requis" });
    }

    const body = new URLSearchParams();
    body.append("data", JSON.stringify({ token, dateDebut, dateFin }));

    const response = await fetch(
      `https://api.ecoledirecte.com/v3/Eleves/${idEleve}/cahierdetexte.awp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      }
    );

    const json = await response.json();
    return res.status(response.status).json(json);
  } catch (e) {
    console.error("Erreur proxy ED cahier de texte:", e);
    return res.status(500).json({ error: "Erreur proxy cahier de texte", details: e.message });
  }
}
