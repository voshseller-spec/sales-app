import { redirect } from "next/navigation";
import { reps } from "@/lib/mock";

export default function ProfileIndex() {
  redirect(`/profile/${reps[0].id}`);
}
