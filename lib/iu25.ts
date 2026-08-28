import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { photos } from "@/lib/media";

const EXTS = /\.(jpe?g|png|webp|avif)$/i;

export type Iu25Item = {
  image: string;
  text: string;
};

export async function listIu25Photos(): Promise<Iu25Item[]> {
  const dir = join(process.cwd(), "public/images/iu25");

  try {
    const files = await readdir(dir);
    const items = files
      .filter((file) => EXTS.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => ({
        image: `/images/iu25/${encodeURIComponent(file)}`,
        text: "",
      }));
    if (items.length) return items;
  } catch {
    // Folder missing or unreadable — fall through to existing gallery stills.
  }

  return photos.gallery.map((shot) => ({
    image: shot.src,
    text: "",
  }));
}
