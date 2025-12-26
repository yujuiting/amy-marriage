"use client";

import { useEffect, useState, useCallback } from "react";
import type { Donation } from "@/app/api/donations/route";

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    try {
      const response = await fetch("/api/donations");
      const data = await response.json();
      if (data.donations) {
        setDonations(data.donations);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch donations");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 15000);
    return () => clearInterval(interval);
  }, [fetchDonations]);

  return { donations, isLoading, error, refetch: fetchDonations };
}
