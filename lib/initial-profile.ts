import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("sign-in");
  }

  const findUserById = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (findUserById) {
    return findUserById;
  }

  const newUser = await db.profile.create({
    data: {
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
    },
  });

  return newUser;
};
