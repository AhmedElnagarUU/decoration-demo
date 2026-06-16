import { routing } from "@/i18n/routing";
import { revalidatePath } from "next/cache";

export function revalidateContentPaths(): void {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/banners");
  revalidatePath("/dashboard/inquiries");
  revalidatePath("/dashboard/social");
  revalidatePath("/dashboard/pixels");
  revalidatePath("/dashboard/privacy");

  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`, "layout");
    revalidatePath(`/${locale}/work`);
    revalidatePath(`/${locale}/privacy`);
  }
}
