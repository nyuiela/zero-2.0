"use client"
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Repeat2 } from "lucide-react";
import CustomCoinbaseSwap from './custom-coinbase-swap';
import { Button } from "./ui/button";

export default function SwapWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button
        className="fixed z-50 bottom-8 right-8 w-16 h-16 rounded-full bg-black shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Swap"
      >
        <Repeat2 className="w-8 h-8 text-white" />
      </Button>
      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg w-[95vw] sm:w-full p-0 rounded-2xl overflow-hidden bg-white shadow-2xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b flex-shrink-0">
            <span className="font-bold text-lg">Swap Tokens</span>
          </div>
          {/* <div className="flex-1 overflow-y-auto p-4 sm:p-6"> */}
          <CustomCoinbaseSwap className="border-none shadow-none" header="" />
          {/* </div> */}
        </DialogContent>
      </Dialog >
    </>
  );
} 