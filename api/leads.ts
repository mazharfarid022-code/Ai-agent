export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

  if (!APOLLO_API_KEY) {
    return res.status(500).json({
      error: "Apollo API key not configured",
    });
  }

  try {
    const { count = 25, industry = "", source = "" } = req.body;

    const response = await fetch(
      "https://api.apollo.io/api/v1/mixed_people/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": APOLLO_API_KEY,
        },
        body: JSON.stringify({
          page: 1,
          per_page: count,
          person_titles: [],
          organization_num_employees_ranges: [],
          q_organization_keyword_tags: industry ? [industry] : [],
          q_keywords: source || "",
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
}