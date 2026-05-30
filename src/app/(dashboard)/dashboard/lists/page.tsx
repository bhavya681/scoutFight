"use client";

import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRecruitmentStore } from "@/stores/recruitment-store";
import { useEffect, useState } from "react";
import type { TalentProfile } from "@/types";

export default function RecruitmentListsPage() {
  const { lists, createList, deleteList } = useRecruitmentStore();
  const [newName, setNewName] = useState("");
  const [talent, setTalent] = useState<TalentProfile[]>([]);

  useEffect(() => {
    fetch("/api/talent")
      .then((r) => r.json())
      .then((d) => setTalent(d.talent ?? []));
  }, []);

  function handleCreate() {
    if (!newName.trim()) return;
    createList(newName.trim());
    setNewName("");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Shortlists</h1>
      <Card className="p-4 flex gap-2">
        <Input
          placeholder="New shortlist name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button onClick={handleCreate} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Create
        </Button>
      </Card>
      <div className="grid gap-4">
        {lists.map((list) => {
          const members = talent.filter((t) => list.talentIds.includes(t.id));
          return (
            <Card key={list.id} className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand" />
                    {list.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2">
                    {members.length} athlete{members.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteList(list.id)}>
                  Delete
                </Button>
              </div>
              {members.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {members.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/athletes/${m.slug}`}
                        className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-brand-muted hover:text-brand"
                      >
                        {m.displayName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
