export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  // Réponse à la requête préliminaire OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Rejet des autres méthodes
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }


  try {
    const { identifiant, motdepasse } = req.body;

    if (!identifiant || !motdepasse) {
      return res.status(400).json({ error: "Identifiant et mot de passe requis" });
    }

    const body = new URLSearchParams();
    body.append("data", JSON.stringify({ identifiant, motdepasse }));

    const response = await fetch("https://api.ecoledirecte.com/v3/login.awp", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const json = await response.json();
    return res.status(response.status).json(json);
  } catch (e) {
    console.error("Erreur proxy ED:", e);
    return res.status(500).json({ error: "Erreur proxy", details: e.message });
  }
}
