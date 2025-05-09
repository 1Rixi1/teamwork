import {auth, getAuth} from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {NextApiRequest} from "next";

export const currentProfilePage = async (req: NextApiRequest) => {
  const { userId } = await getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
};
