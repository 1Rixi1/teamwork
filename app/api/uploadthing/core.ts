import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("UnAuthorized");
  }
  return { userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileCount: 1, maxFileSize: "4MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  fileMessage: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
