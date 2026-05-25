import fs from "fs";
import os from "os";
import path from "path";

/**
 * Résout DATABASE_URL pour la production (ex. Vercel) sans dossier certs/ local.
 * Collez le contenu du fichier .pem dans la variable DATABASE_SSL_CA sur Vercel.
 */
export function resolveDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;

  const ca =
    process.env.DATABASE_SSL_CA?.trim() ||
    process.env.SSL_CA?.trim();

  if (!ca) return url;

  try {
    const caPath = path.join(os.tmpdir(), "mysql-ca.pem");
    const pem = ca.includes("BEGIN CERTIFICATE")
      ? ca.replace(/\\n/g, "\n")
      : Buffer.from(ca, "base64").toString("utf-8");

    fs.writeFileSync(caPath, pem, { mode: 0o600 });

    const [base, query = ""] = url.split("?");
    const params = new URLSearchParams(query);
    params.set("sslca", caPath);
    if (!params.has("sslaccept")) {
      params.set("sslaccept", "strict");
    }

    return `${base}?${params.toString()}`;
  } catch (error) {
    console.error("[database-url] Impossible d'écrire le certificat SSL:", error);
    return url;
  }
}
