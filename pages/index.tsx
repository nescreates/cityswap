import { useState } from "react";

type Item = {
  time: string;
  name: string;
  why: string;
  cost?: string;
  area?: string;
};

export default function Home() {
  const [plan, setPlan] = useState<Item[]>([
    { time: "morning", name: "Local Bakery 🥐", why: "fresh pastries", cost: "£6", area: "Old Town" },
    { time: "afternoon", name: "Street Food Market 🍜", why: "variety + cheap", cost: "£10", area: "Market Square" },
    { time: "evening", name: "Jazz Bar 🎷", why: "live music", cost: "£15", area: "Old Town" },
  ]);

  // 1) keep cards keyed by time slot
const [swappingSlot, setSwappingSlot] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function swapSlot(time: "morning" | "afternoon" | "evening") {
  try {
    setError(null);
    setLoading(true);
    setSwappingSlot(time);

    const current = plan.find((i) => i.time === time);

    // map UI slot -> API pool
    const apiSlot =
      time === "morning" ? "flight" : time === "afternoon" ? "food" : "landmark";

    const res = await fetch("/api/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timeSlot: apiSlot, currentName: current?.name }),
    });

    if (!res.ok) throw new Error("Swap failed");

    const replacement = await res.json();

    // make sure the replacement stays in the same UI slot
    const fixed = { ...replacement, time };

    setPlan((prev) => prev.map((i) => (i.time === time ? fixed : i)));
  } catch (e: any) {
    setError(e.message ?? "Something went wrong");
  } finally {
    setLoading(false);
    setSwappingSlot(null);
  }
}


  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="mx-auto max-w-2xl flex-grow px-5 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-black">CitySwap Travel</h1>
          <div className="flex gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">demo</span>
            <button className="rounded-full bg-gray-900 px-3 py-1 text-xs text-white">GitHub</button>
          </div>
        </header>

        {/* Controls */}
        <div className="mt-2 flex flex-wrap gap-3">
          <button
  onClick={() => swapSlot("morning")}
  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-black hover:bg-gray-300"
  disabled={loading}
>
  {loading && swappingSlot === "morning" ? "Working..." : "Swap Flight"}
</button>

<button
  onClick={() => swapSlot("afternoon")}
  className="rounded-lg bg-blue-200 px-4 py-2 text-sm text-black hover:bg-blue-300"
  disabled={loading}
>
  {loading && swappingSlot === "afternoon" ? "Swapping..." : "Swap Food"}
</button>

<button
  onClick={() => swapSlot("evening")}
  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-black hover:bg-gray-300"
  disabled={loading}
>
  {loading && swappingSlot === "evening" ? "Swapping..." : "Swap Landmark"}
</button>

<button
  onClick={() => {
    const slots = ["morning", "afternoon", "evening"] as const;
    const random = slots[Math.floor(Math.random() * slots.length)];
    swapSlot(random);
  }}
  className="rounded-lg bg-purple-200 px-4 py-2 text-sm text-black hover:bg-purple-300"
  disabled={loading}
>
  Surprise Me 🎲
</button>

        </div>

        {error && (
          <div className="mt-3 rounded border border-red-400 bg-red-100 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Itinerary */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-medium text-black">Today’s Travel Plan</h2>
          <ul className="space-y-3">
            {plan.map((i) => (
              <li
                key={i.time + "-" + i.name}
                className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
              >
                <p className="text-[11px] uppercase tracking-wide text-black">{i.time}</p>
                <div className="mt-1 text-[15px] font-semibold text-black">{i.name}</div>
                <div className="mt-1 text-sm text-black">{i.why}</div>
                <div className="mt-1 text-sm text-black">
                  {i.cost ?? ""} · {i.area ?? ""}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Skyline footer */}
        <footer className="mt-10">
          <img
            src="/skyscraper-pro.svg"
            alt="City skyline outline"
            className="mx-auto block h-28 w-full object-cover opacity-90"
            loading="lazy"
          />
        </footer>
      </main>
    </div>
  );
}






      
       






