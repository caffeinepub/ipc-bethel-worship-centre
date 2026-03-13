import { useMutation, useQuery } from "@tanstack/react-query";
import type { Event, Sermon } from "../backend.d";
import { useActor } from "./useActor";

export function useSermons() {
  const { actor, isFetching } = useActor();
  return useQuery<Sermon[]>({
    queryKey: ["sermons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSermons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitContactForm(
        data.name,
        data.email,
        data.phone || null,
        data.message,
      );
    },
  });
}
