import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "CV — Abdirahman Mohamed",
};

export default function CVPage() {
  redirect("/cv.pdf");
}
