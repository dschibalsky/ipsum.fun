import Database from "better-sqlite3";
import path from "path";

class PageviewTracker {
  private db: Database.Database;

  constructor() {
    // Dynamischer Pfad für Entwicklung und Produktion
    const dbPath = process.env.SQLITE_PATH || path.resolve("./pageviews.db");

    // Datenbank initialisieren
    this.db = new Database(dbPath);

    // Tabelle erstellen, falls nicht existiert
    this.db
      .prepare(
        `
      CREATE TABLE IF NOT EXISTS pageviews (
        slug TEXT PRIMARY KEY,
        views INTEGER DEFAULT 0,
        last_viewed DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
      )
      .run();

    // Index für Performance
    this.db
      .prepare(
        `
      CREATE INDEX IF NOT EXISTS idx_slug ON pageviews(slug)
    `
      )
      .run();
  }

  // IP-Tracking verhindern
  incrementPageview(slug: string, ip?: string): number {
    try {
      // Prüfe und verhindere Mehrfachzählung pro IP (optional)
      if (ip) {
        const ipTrackKey = `${slug}:${ip}`;
        const existingTrack = this.db
          .prepare(
            `SELECT 1 FROM ip_tracking 
           WHERE track_key = ? AND timestamp > datetime('now', '-1 day')`
          )
          .get(ipTrackKey);

        if (existingTrack) {
          return 0; // Bereits gezählt
        }

        // IP-Tracking speichern
        this.db
          .prepare(
            `
          INSERT OR REPLACE INTO ip_tracking (track_key, timestamp) 
          VALUES (?, datetime('now'))
        `
          )
          .run(ipTrackKey);
      }

      // Pageview inkrementieren
      const stmt = this.db.prepare(`
        INSERT INTO pageviews (slug, views, last_viewed)
        VALUES (?, 1, datetime('now'))
        ON CONFLICT(slug) DO UPDATE SET 
        views = views + 1,
        last_viewed = datetime('now')
      `);

      stmt.run(slug);

      // Aktuelle Anzahl der Views zurückgeben
      const result = this.db
        .prepare(`SELECT views FROM pageviews WHERE slug = ?`)
        .get(slug) as { views: number } | undefined;

      return result ? result.views : 0;
    } catch (error) {
      console.error("Pageview tracking error:", error);
      return 0;
    }
  }

  // Pageviews für alle Projekte abrufen
  getPageviews(projects: { slug: string }[]): Record<string, number> {
    const viewsMap: Record<string, number> = {};

    projects.forEach((project) => {
      const result = this.db
        .prepare(`SELECT views FROM pageviews WHERE slug = ?`)
        .get(project.slug) as { views: number } | undefined;

      viewsMap[project.slug] = result ? result.views : 0;
    });

    return viewsMap;
  }
}

// Singleton-Instanz
export const pageviewTracker = new PageviewTracker();
