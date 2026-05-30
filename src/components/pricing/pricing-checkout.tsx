"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PricingCheckout({ planId }: { planId: string }) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, interval: "monthly" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.message ?? "Configure Stripe to enable checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button className="w-full" onClick={checkout} disabled={loading}>
      {loading ? "Loading..." : "Subscribe"}
    </Button>
  );
}
