"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUIStore } from "@/stores/ui-store";
import { TalentAiIcon } from "@/components/ai/talent-ai-icon";
import { AiMatchmakerForm } from "@/components/ai/ai-matchmaker-form";
import { AiScoutChat } from "@/components/ai/ai-scout-chat";

export function TalentAiPanel() {
  const { talentAiOpen, talentAiTab, setTalentAiOpen, setTalentAiTab } = useUIStore();

  return (
    <AnimatePresence>
      {talentAiOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setTalentAiOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[60] flex h-full w-full max-w-full sm:max-w-md flex-col border-l border-border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <TalentAiIcon variant="panel" size="lg" active />
                <div className="min-w-0">
                  <h2 className="font-display font-semibold text-sm tracking-wide text-foreground">
                    Talent Research
                  </h2>
                  <p className="text-[11px] text-muted-foreground truncate">
                    AI recruitment & roster scouting
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setTalentAiOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Tabs
              value={talentAiTab}
              onValueChange={(v) => setTalentAiTab(v as "matchmaker" | "scout")}
              className="flex flex-1 flex-col min-h-0"
            >
              <div className="px-4 pt-3">
                <TabsList className="w-full grid grid-cols-2 h-10 bg-muted/40">
                  <TabsTrigger value="matchmaker" className="text-xs sm:text-sm">
                    Event matchmaker
                  </TabsTrigger>
                  <TabsTrigger value="scout" className="text-xs sm:text-sm">
                    Scout query
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
                <TabsContent value="matchmaker" className="mt-4 focus-visible:outline-none">
                  <AiMatchmakerForm onNavigateAway={() => setTalentAiOpen(false)} />
                </TabsContent>
                <TabsContent
                  value="scout"
                  className="mt-4 flex flex-col min-h-[calc(100vh-12rem)] focus-visible:outline-none"
                >
                  <AiScoutChat />
                </TabsContent>
              </div>
            </Tabs>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** @deprecated Use TalentAiPanel */
export const AiMatchmakerPanel = TalentAiPanel;
