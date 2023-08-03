import { ScheduledEvent } from "@/types/models/scheduledEvent";
import { Typography } from "@/ui/Typography";
import { Button, Group, MediaQuery, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

const sortOptions = {
  "scheduleDateTime desc": {
    label: "Newest",
    orderBy: "scheduleDateTime",
    sortBy: "desc",
  },
  "scheduleDateTime asc": {
    label: "Oldest",
    orderBy: "scheduleDateTime",
    sortBy: "asc",
  },
  "title asc": { label: "Event title (A-Z)", orderBy: "title", sortBy: "asc" },
  "title desc": {
    label: "Event title (Z-A)",
    orderBy: "title",
    sortBy: "desc",
  },
} as const;

type sortOption = keyof typeof sortOptions;

export const SortMenu: React.FC<{
  onSortChanged: (value: [keyof ScheduledEvent, string]) => void;
}> = ({ onSortChanged }) => {
  const [sortBy, setSortBy] = useState<sortOption>("scheduleDateTime desc");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortByOps, setSortByOps] = useState<[keyof ScheduledEvent, string]>([
    "createdAt",
    "desc",
  ]);
  return (
    <Group>
      <MediaQuery styles={{ display: "none" }} smallerThan={"xs"}>
        <Typography textVariant="title-md">Sort by</Typography>
      </MediaQuery>
      <Menu position="bottom-end">
        <Menu.Target>
          <Button
            variant="outline"
            color="black"
            radius={"md"}
            sx={(theme) => ({ borderColor: theme.colors.gray[4] })}
            rightIcon={<IconChevronDown />}
          >
            <Typography textVariant="label-lg" color="black">
              {sortOptions[sortBy].label}
            </Typography>
          </Button>
        </Menu.Target>
        <Menu.Dropdown sx={{ minWidth: 200 }}>
          {Object.entries(sortOptions)
            .map((sortOption) =>
              Object.assign(sortOption[1], { value: sortOption[0] })
            )
            .map((sortOption) => (
              <Menu.Item
                key={sortOption.value}
                value={sortOption.value}
                sx={(theme) => ({
                  background:
                    sortBy === sortOption.value
                      ? theme.colors.blue[0]
                      : "unset",
                  ":hover": {
                    background:
                      sortBy === sortOption.value
                        ? theme.colors.blue[0]
                        : theme.colors.gray[0],
                  },
                })}
                onClick={() => {
                  setSortBy(sortOption.value as sortOption);
                  setSortByOps([sortOption.orderBy, sortOption.sortBy]);
                  onSortChanged([sortOption.orderBy, sortOption.sortBy]);
                }}
              >
                {sortOption.label}
              </Menu.Item>
            ))}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};
