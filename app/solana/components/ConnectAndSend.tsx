"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import { useState } from "react";
import bs58 from "bs58";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function ConnectAndSend() {
  const [serializedTxn, setSerializedTxn] = useState<string>();

  const { connection } = useConnection();
  const { sendTransaction } = useWallet();

  async function signAndSendTransaction() {
    if (!serializedTxn) {
      console.error("Serialized transaction is required");
      return;
    }

    const transaction = Transaction.from(bs58.decode(serializedTxn));
    console.log("Sending transaction:", transaction);

    try {
      await sendTransaction(transaction, connection);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  }

  return (
    <div className="flex w-full flex-col items-start p-5">
      <div className="flex items-center justify-between">
        <WalletMultiButton />
      </div>

      <textarea
        value={serializedTxn}
        onChange={(e) => setSerializedTxn(e.target.value as `0x${string}`)}
        placeholder="Enter serializedTransaction from API response"
        className="w-full h-40 px-3 py-2 font-mono text-sm my-2 text-gray-700 placeholder-gray-300 rounded focus:outline-none"
      />
      <div className="flex justify-between gap-2 mb-2">
        <button
          onClick={() => signAndSendTransaction()}
          disabled={!serializedTxn}
          className={`bg-gradient-to-br from-[#01b15d] to-[#0296a8] hover:bg-gradient-to-br hover:from-[#00ff85] hover:to-[#00e1fc] text-white font-bold py-2 px-4 rounded ${
            !serializedTxn ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Send Transaction
        </button>
        {/* {isPending && (
              <div className="pt-5">
                Awaiting confirmation...<div className="ml-3 spinner"></div>
              </div>
            )} */}
      </div>
      {/* {hash && (
            <div className="p-2 bg-gray-900 overflow-auto rounded">
              Receipt:{" "}
              <pre>
                <code>{hash}</code>
              </pre>
            </div>
          )} */}
    </div>
  );
}
