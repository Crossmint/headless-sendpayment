"use client";

import { useState } from "react";
import { parseTransaction } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction } from "wagmi";

const SendPayment = () => {
  const [serializedTxn, setSerializedTxn] = useState<`0x${string}`>();
  const { data: hash, isPending, sendTransactionAsync } = useSendTransaction();

  const signAndSendTransaction = async () => {
    const txn = parseTransaction(serializedTxn || "0x");

    await sendTransactionAsync({
      to: txn.to as `0x${string}`,
      value: BigInt(txn.value ? txn.value.toString() : "0"),
      data: txn.data as `0x${string}`,
      chainId: txn.chainId,
    });
  };

  return (
    <>
      <div className="p-5">
        <ConnectButton
          showBalance={false}
          chainStatus="full"
          accountStatus="full"
        />
        <div className="py-2 px-5 my-2 w-full bg-green-100 text-green-700 border border-green-400 rounded">
          Select same network indicated in the order! <br />
          Probably
          <strong>
            <code> base-sepolia</code>
          </strong>
        </div>
        <textarea
          value={serializedTxn}
          onChange={(e) => setSerializedTxn(e.target.value as `0x${string}`)}
          placeholder="Enter serializedTransaction from API response"
          className="w-full h-40 px-3 py-2 font-mono text-sm text-gray-700 placeholder-gray-300 rounded focus:outline-none"
        />
        <div className="flex justify-between gap-2 mb-2">
          <button
            onClick={() => signAndSendTransaction()}
            disabled={!serializedTxn || isPending}
            className={`bg-gradient-to-br from-[#01b15d] to-[#0296a8] hover:bg-gradient-to-br hover:from-[#00ff85] hover:to-[#00e1fc] text-white font-bold py-2 px-4 rounded ${
              !serializedTxn ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Send Transaction
          </button>
          {isPending && (
            <div className="pt-5">
              Awaiting confirmation...<div className="ml-3 spinner"></div>
            </div>
          )}
        </div>
        {hash && (
          <div className="p-2 bg-gray-900 overflow-auto rounded">
            Receipt:{" "}
            <pre>
              <code>{hash}</code>
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default SendPayment;
