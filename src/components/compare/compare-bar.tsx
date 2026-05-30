"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserAvatar } from "@/components/ui/user-avatar";
import { GitCompare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/stores/compare-store";

export function CompareBar() {
  const { items, remove, clear } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-background/95 backdrop-blur-xl p-4 shadow-2xl"
      >
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold shrink-0">
            <GitCompare className="h-4 w-4 text-pwr-red" />
            Compare ({items.length}/4)
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 glass-card rounded-lg px-2 py-1 shrink-0"
              >
                <UserAvatar name={item.displayName} src={item.avatarUrl} size="xs" />
                <span className="text-xs font-medium max-w-[100px] truncate">
                  {item.displayName}
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={clear}>
              Clear
            </Button>
            <Button size="sm" asChild disabled={items.length < 2}>
              <Link href="/compare">Compare Now</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
