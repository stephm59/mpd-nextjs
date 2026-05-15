import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { exporterRdvsCSV, type RdvFiltres } from "@/lib/admin/rdv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filtres: Omit<RdvFiltres, "page"> = {
    statut: (searchParams.get("statut") as RdvFiltres["statut"]) ?? "tous",
    technicienId: searchParams.get("tech") ?? undefined,
    serviceId: searchParams.get("service") ?? undefined,
    recherche: searchParams.get("q") ?? undefined,
  };

  const csv = await exporterRdvsCSV(filtres);
  const filename = `rdv-mpd-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
