import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/toggke-theme";

export default function Home() {
  return (
    <div>
      <ModeToggle />
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
