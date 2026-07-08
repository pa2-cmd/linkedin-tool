import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// In-memory fallback for local development if Firebase variables are not set
class MockDocumentReference {
  constructor(private collectionName: string, private docId: string, private db: MockFirestore) {}

  async get() {
    const data = this.db.store[this.collectionName]?.[this.docId];
    return {
      exists: !!data,
      id: this.docId,
      data: () => data || null,
    };
  }

  async set(data: any, options?: { merge?: boolean }) {
    if (!this.db.store[this.collectionName]) {
      this.db.store[this.collectionName] = {};
    }
    const existing = this.db.store[this.collectionName][this.docId] || {};
    this.db.store[this.collectionName][this.docId] = options?.merge
      ? { ...existing, ...data }
      : data;
    return this;
  }

  async update(data: any) {
    return this.set(data, { merge: true });
  }

  async delete() {
    if (this.db.store[this.collectionName]) {
      delete this.db.store[this.collectionName][this.docId];
    }
    return this;
  }
}

class MockQuery {
  private orderByField: string | null = null;
  private orderDirection: "asc" | "desc" = "asc";
  private limitCount: number | null = null;
  private filters: Array<{ field: string; op: string; value: any }> = [];

  constructor(protected collectionName: string, protected db: MockFirestore) {}

  where(field: string, op: string, value: any) {
    this.filters.push({ field, op, value });
    return this;
  }

  orderBy(field: string, direction: "asc" | "desc" = "asc") {
    this.orderByField = field;
    this.orderDirection = direction;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  async get() {
    const colData = this.db.store[this.collectionName] || {};
    let docs = Object.entries(colData).map(([id, val]: [string, any]) => ({
      id,
      ...val,
    }));

    // Apply filters
    for (const filter of this.filters) {
      docs = docs.filter((doc) => {
        const val = doc[filter.field];
        if (filter.op === "==") return val === filter.value;
        return true;
      });
    }

    // Apply sorting
    if (this.orderByField) {
      const field = this.orderByField;
      const dir = this.orderDirection === "asc" ? 1 : -1;
      docs.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        
        // Handle dates/timestamps or strings
        const timeA = valA instanceof Date ? valA.getTime() : typeof valA === "string" ? new Date(valA).getTime() || valA : valA;
        const timeB = valB instanceof Date ? valB.getTime() : typeof valB === "string" ? new Date(valB).getTime() || valB : valB;

        if (timeA < timeB) return -1 * dir;
        if (timeA > timeB) return 1 * dir;
        return 0;
      });
    }

    // Apply limit
    if (this.limitCount !== null) {
      docs = docs.slice(0, this.limitCount);
    }

    return {
      docs: docs.map((doc) => ({
        id: doc.id,
        exists: true,
        data: () => {
          const { id, ...rest } = doc;
          return rest;
        },
      })),
      empty: docs.length === 0,
      size: docs.length,
    };
  }
}

class MockCollectionReference extends MockQuery {
  constructor(collectionName: string, db: MockFirestore) {
    super(collectionName, db);
  }

  doc(id?: string) {
    const docId = id || Math.random().toString(36).slice(2, 11);
    return new MockDocumentReference(this.collectionName, docId, this.db);
  }

  async add(data: any) {
    const docId = Math.random().toString(36).slice(2, 11);
    const docRef = this.doc(docId);
    
    // Auto add createdAt if not present
    const docData = {
      ...data,
      createdAt: data.createdAt || new Date(),
    };
    
    await docRef.set(docData);
    return {
      id: docId,
      get: async () => docRef.get(),
    };
  }
}

class MockFirestore {
  // In-memory data store
  public store: Record<string, Record<string, any>> = {
    weekly_metrics: {
      "week-1": { weekStart: new Date("2026-06-15T00:00:00Z"), connections: 450, profileViews: 120, searchAppearances: 45, postImpressions: 1200, createdAt: new Date() },
      "week-2": { weekStart: new Date("2026-06-22T00:00:00Z"), connections: 480, profileViews: 155, searchAppearances: 52, postImpressions: 1800, createdAt: new Date() },
      "week-3": { weekStart: new Date("2026-06-29T00:00:00Z"), connections: 510, profileViews: 140, searchAppearances: 48, postImpressions: 2100, createdAt: new Date() },
      "week-4": { weekStart: new Date("2026-07-06T00:00:00Z"), connections: 545, profileViews: 185, searchAppearances: 60, postImpressions: 3200, createdAt: new Date() },
    },
    posts: {
      "post-1": { topic: "AI Trends", format: "thought_leadership", tone: "professional", content: "AI is reshaping how we build tools. Agents are the next layer.", scheduledFor: new Date("2026-07-10T12:00:00Z"), status: "scheduled", createdAt: new Date() },
    },
    viral_posts: {
      "vpost-1": { author: "Justin Welsh", content: "The best systems are the simplest. Build once, sell twice.", likes: 12400, comments: 852, shares: 341, category: "business", url: "https://linkedin.com/posts/justin-welsh-1", createdAt: new Date() },
      "vpost-2": { author: "Marc Lou", content: "Stop coding features people don't want. Ship fast, pivot, iterate.", likes: 8900, comments: 612, shares: 198, category: "tech", url: "https://linkedin.com/posts/marc-lou-1", createdAt: new Date() },
    },
    leads: {
      "lead-1": { name: "Sarah Jenkins", headline: "Talent Acquisition Manager @ Google", location: "London, UK", profileUrl: "https://linkedin.com/in/sarah-j", company: "Google", status: "prospect", notes: "Prefers concise outreach.", createdAt: new Date() }
    }
  };

  collection(name: string) {
    return new MockCollectionReference(name, this);
  }
}

let dbInstance: any;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (projectId && clientEmail && privateKey) {
  try {
    const appsList = getApps();
    let app;
    if (appsList.length === 0) {
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      app = getApp();
    }
    dbInstance = getFirestore(app);
    console.log("Firebase Admin SDK successfully initialized.");
  } catch (error) {
    console.error("Firebase Admin SDK initialization failed, falling back to mock database:", error);
    dbInstance = new MockFirestore();
  }
} else {
  console.warn(
    "Firebase environment credentials missing. Operating in local Mock database mode."
  );
  dbInstance = new MockFirestore();
}

export const db = dbInstance;
