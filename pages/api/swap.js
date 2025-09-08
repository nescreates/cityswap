// pages/api/swap.js
export default function handler(req, res) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const timeSlot = body?.timeSlot || "food";      // "flight" | "food" | "landmark"
    const currentName = body?.currentName || "";

    // cost scale: 1 = £, 2 = ££, 3 = £££ (you can change numbers or add real prices later)
    const pool = {
      flight: [
        { time: "morning",  name: "Morning Flight ✈️",     why: "on-time & smooth",    cost: 2, area: "Baixa" },
        { time: "morning",  name: "Early Budget Flight ✈️", why: "cheaper fare",       cost: 1, area: "Alcântara" },
        { time: "evening",  name: "Evening Flight ✈️",     why: "great connection",    cost: 3, area: "Airport" },
      ],
      food: [
        { time: "afternoon", name: "Street Food Market",   why: "variety + cheap",     cost: 1, area: "Market Sq" },
        { time: "afternoon", name: "Local Food Tour 🍜",   why: "authentic street food",cost: 2, area: "Old Town" },
        { time: "afternoon", name: "Riverside Bistro 🥗",  why: "views + seasonal",    cost: 3, area: "Ribeira" },
      ],
      landmark: [
        { time: "evening", name: "Eiffel Tower 🗼",        why: "iconic city views",   cost: 2, area: "7th Arr." },
        { time: "evening", name: "Montmartre Walk 🎨",     why: "artists & views",     cost: 1, area: "Montmartre" },
        { time: "evening", name: "Louvre at Night 🖼️",     why: "less crowded",        cost: 3, area: "1st Arr." },
      ],
    };

    const list = pool[timeSlot] || [];
    if (!list.length) {
      return res.status(400).json({ error: "Unknown time slot" });
    }

    // pick a different option than the current card’s name
    const candidate = list.find(i => i.name !== currentName) || list[0];

    // Always return full object the frontend expects
    return res.status(200).json({
      time: candidate.time,
      name: candidate.name,
      why: candidate.why,
      cost: candidate.cost,     // <= important
      area: candidate.area,     // <= important
    });
  } catch (e) {
    console.error("swap route error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}



