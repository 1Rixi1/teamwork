"use client";

import React, { useEffect, useState } from "react";
import CreateServerModal from "@/components/modals/create-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import EditModal from "@/components/modals/edit-modal";
import MembersModal from "@/components/modals/members-modal";

const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />;
      <InviteModal />
      <EditModal />
      <MembersModal />
    </>
  );
};

export default ModalProvider;
