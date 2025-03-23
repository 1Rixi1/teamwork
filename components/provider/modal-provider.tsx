"use client";

import React, { useEffect, useState } from "react";
import CreateServerModal from "@/components/models/create-server-modal";

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
    </>
  );
};

export default ModalProvider;
