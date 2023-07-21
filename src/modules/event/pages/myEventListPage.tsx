import { ProtectedPage } from "@/modules/auth/components/ProtectedPage";
import { Typography } from "@/ui/Typography";
import {
  Button,
  Flex,
  SimpleGrid,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { EventCard } from "../components/eventCard";
import { SearchBar } from "../components/searchbar";
import { SortMenu } from "../components/sortMenu";
import { useEventsList } from "../store/useEventList";
import { useEventMemberList } from "../store/useEventMemberList";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { ScheduledEvent } from "@/types/models/scheduledEvent";
import { EmptyData } from "../components/emptyData";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

export const MyEventListPage = () => {
  const navigate = useNavigate();
  const t = useMantineTheme();
  const largerThanXS = useMediaQuery(`(min-width: ${t.breakpoints.xs}`);

  const [search, setSearch] = useState<string>();
  const { user } = useAuthStore();
  const { events, getEvents, loading, sortEvents } = useEventsList();
  const {
    eventMembers,
    getEventMembers,
    loading: loadingEventMember,
  } = useEventMemberList();

  useEffect(() => {
    getEvents();
    if (user && user.id) getEventMembers(user.id);
  }, [getEvents, user, getEventMembers]);

  const myEvents = eventMembers
    ?.map((em) => events?.find((ev) => ev.id === em.eventId))
    .filter((evm) => evm !== undefined)
    .filter((evnt) =>
      search ? evnt!.title.toLowerCase().includes(search.toLowerCase()) : true
    ) as ScheduledEvent[] | undefined;

  return (
    <ProtectedPage>
      <Stack spacing={24}>
        <Typography textVariant="headline-lg">My Events</Typography>
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
            (myEvents && myEvents.length > 0) || loading
              ? largerThanXS
                ? 4
                : 1
              : 1
          }
        >
          {loading || loadingEventMember ? (
            Array(8)
              .fill("-")
              .map((i, id) => {
                return <EventCard key={id} loading />;
              })
          ) : myEvents && myEvents.length > 0 ? (
            myEvents.map((ev) => {
              return <EventCard key={ev.id} eventData={ev} />;
            })
          ) : (
            <EmptyData desc="Track and access your joined events in one place. Start your energy efficiency journey by browsing available events in the All Events page.">
              <Button
                onClick={() => {
                  navigate("../events");
                }}
                sx={{ borderRadius: 8 }}
              >
                Browse events
              </Button>
            </EmptyData>
          )}
        </SimpleGrid>
      </Stack>
    </ProtectedPage>
  );
};
