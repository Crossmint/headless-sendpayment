"use client";

import dynamic from "next/dynamic";

const ConnectAndSend = dynamic(
  () => import("./components/ConnectAndSend").then((mod) => mod.ConnectAndSend),
  {
    ssr: false,
  }
);

export default function SolanaSendTranactionPage() {
  return <ConnectAndSend />;
}
