import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { Typography } from "@/ui/Typography";
import { Flex, SimpleGrid, Stack, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { EventCard } from "../components/eventCard";
import { SearchBar } from "../components/searchbar";
import { SortMenu } from "../components/sortMenu";
import { useEventsList } from "../store/useEventList";
import { EmptyData } from "../components/emptyData";
import { useEventMemberList } from "../store/useEventMemberList";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { useMediaQuery } from "@mantine/hooks";

export const EventListPages: React.FC = () => {
  const [search, setSearch] = useState<string>();
  const { user } = useAuthStore();
  const { events, getEvents, loading, sortEvents } = useEventsList();
  const { eventMembers, getEventMembers } = useEventMemberList();
  const t = useMantineTheme();
  const largerThanXS = useMediaQuery(`(min-width: ${t.breakpoints.xs}`);
  useEffect(() => {
    getEvents();
    if (user) getEventMembers(user.id);
  }, [getEvents, user, getEventMembers]);

  const filteredEvents = events?.filter((evnt) =>
    search ? evnt.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <ProtectedPage>
      <Stack spacing={24}>
        <Typography textVariant="headline-lg">All Events</Typography>
        <Flex justify="space-between">
          <SearchBar
            value={search || ""}
            onChange={(value) => setSearch(value)}
          />
          <SortMenu
            onSortChanged={(val) => {
              sortEvents(val[0], val[1] as "asc" | "desc");
            }}
          />
        </Flex>
        <SimpleGrid
          cols={
            (filteredEvents && filteredEvents.length > 0) || loading
              ? largerThanXS
                ? 4
                : 1
              : 1
          }
        >
          {loading ? (
            Array(8)
              .fill("-")
              .map((i, id) => {
                return <EventCard key={id} loading />;
              })
          ) : filteredEvents && filteredEvents.length > 0 ? (
            filteredEvents.map((ev) => {
              return (
                <EventCard
                  key={ev.id}
                  eventData={ev}
                  isRegistered={
                    eventMembers?.find((em) => em.eventId === ev.id) !==
                    undefined
                  }
                />
              );
            })
          ) : (
            <EmptyData />
          )}
        </SimpleGrid>
      </Stack>
    </ProtectedPage>
  );
};
