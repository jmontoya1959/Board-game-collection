import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const res = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`);
    const xml = await res.text();
    const json = await parseStringPromise(xml);

    const item = json.items.item?.[0];
    if (!item) return NextResponse.json({ error: "Game not found" }, { status: 404 });

    const game = {
      id,
      name: item.name?.[0]?.$.value || "Unknown",
      description: item.description?.[0] || "No description",
      image: item.image?.[0] || null,
      year: item.yearpublished?.[0]?.$.value || "Unknown"
    };

    return NextResponse.json({ game });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}
