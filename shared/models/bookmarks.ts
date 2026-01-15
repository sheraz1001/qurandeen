import { sql, relations } from "drizzle-orm";
import { pgTable, varchar, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  surahName: varchar("surah_name", { length: 100 }),
  surahNameArabic: varchar("surah_name_arabic", { length: 100 }),
  ayahText: varchar("ayah_text", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  unique("unique_user_bookmark").on(table.userId, table.surahNumber, table.ayahNumber)
]);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = typeof bookmarks.$inferInsert;
