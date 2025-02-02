// app/not-found.tsx
import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("/not-found"); // Redirect to home page instead of showing 404
}
