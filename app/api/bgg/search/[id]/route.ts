import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`);
    const xml = await response.text();
    const result = await parseStringPromise(xml);

    const games = result.items.item?.map((item: any) => ({
      id: item.$.id,
      name: item.name[0].$.value,
      year: item.yearpublished?.[0]?.$.value || "Unknown"
    })) || [];

    return NextResponse.json({ games });
  } catch (error) {
    console.error("BGG search error:", error);
    return NextResponse.json({ error: "Failed to fetch data from BGG" }, { status: 500 });
  }
}
