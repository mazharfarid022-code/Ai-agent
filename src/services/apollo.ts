export async function generateRealLeads(filters: {
  count: number;
  source?: string;
  industry?: string;
}) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  const data = await response.json();

  const people = data.people || data.contacts || [];

  return people.map((person: any) => ({
    id: crypto.randomUUID(),
    name: person.name || `${person.first_name || ""} ${person.last_name || ""}`.trim(),
    company: person.organization?.name || "",
    email: person.email || "",
    phone: person.phone || "",
    website: person.organization?.website_url || "",
    linkedin: person.linkedin_url || "",
    industry:
      person.organization?.industry ||
      filters.industry ||
      "Unknown",
    location:
      person.city && person.state
        ? `${person.city}, ${person.state}`
        : person.country || "",
    source: filters.source || "Apollo",
    status: "cold",
    score: 70,
    notes: "",
    createdAt: new Date().toISOString(),
  }));
}
