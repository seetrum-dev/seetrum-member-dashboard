import { NavLink, SegmentedControl, Stack, ThemeIcon } from "@mantine/core";

import { useAuthStore } from "@/modules/auth/stores/authStore";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IconAdminAward,
  IconAdminBriefcase,
  IconAdminCalendar,
  IconAdminPeople,
  IconAward,
  IconBriefcase,
  IconCalendar,
  IconHome,
} from "../Icons";

type NavLinkDataProps = {
  label: string;
  icon?: React.ReactNode;
  link?: string;
  isAdmin?: boolean;
};

type MainLinkProps = {
  links?: NavLinkDataProps[];
  onNavigate?: (path: string) => void;
} & NavLinkDataProps;

const MainLink: React.FC<MainLinkProps> = ({
  label,
  icon,
  link,
  links,
  onNavigate = (p) => {},
}) => {
  const navigate = useNavigate();
  const [isExpand, setExpand] = useState<boolean>(false);

  const handleNavigate = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    link?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (link) {
      navigate(link);
      onNavigate(link);
    } else {
      notifications.show({
        title: "Coming Soon",
        message: "Stay tuned for the next updates",
      });
    }
  };
  const location = useLocation();
  const isHome = link === "/";
  const isActive = isHome
    ? location.pathname === link
    : Boolean(link && location.pathname.startsWith(link));
  const isChildActive = Boolean(
    links &&
      links
        .map((l) =>
          Boolean(
            l.link &&
              location.pathname.split("/")[1] === l.link.replace("/", "")
          )
        )
        .filter((i) => i).length > 0
  );
  const hasLinks = links && Array.isArray(links);

  return (
    <NavLink
      mt={8}
      key={label}
      label={label}
      opened={(isChildActive && hasLinks) || isExpand}
      defaultOpened={false}
      active={isActive}
      icon={
        <ThemeIcon color="biceblue.5" variant="outline" sx={{ border: "none" }}>
          {icon}
        </ThemeIcon>
      }
      onClick={(e) => (!links ? handleNavigate(e, link) : setExpand(!isExpand))}
    >
      {hasLinks
        ? links.map((submenu, idx) => {
            const active = Boolean(
              submenu.link &&
                location.pathname.split("/")[1] ===
                  submenu.link.replace("/", "")
            );
            return (
              <NavLink
                key={idx}
                {...submenu}
                active={active}
                onClick={(e) => handleNavigate(e, submenu.link)}
                sx={(theme) => ({
                  borderLeft: "1px solid",
                  borderColor: theme.colors.gray[4],
                  marginInlineStart: 4,
                  paddingInlineStart: 26,
                })}
              />
            );
          })
        : undefined}
    </NavLink>
  );
};

const data: MainLinkProps[] = [
  {
    icon: <IconHome size="20px" />,
    label: "Home",
    link: "/",
  },
  {
    icon: <IconCalendar size="20px" />,
    label: "Events",
    links: [
      { label: "All Events", link: "/events" },
      { label: "My Events", link: "/myevents" },
    ],
  },
  {
    icon: <IconAward size="20px" />,
    label: "Trainings",
    links: [
      { label: "All trainings", link: "/trainings" },
      { label: "My trainings", link: "/mytrainings" },
    ],
  },
  {
    icon: <IconBriefcase size="20px" />,
    label: "Opportunities",
    links: [
      { label: "All opportunities", link: "/opportunities" },
      { label: "My opportunities", link: "/myopportunities" },
    ],
  },
  // Admin Links
  {
    icon: <IconAdminPeople size="20px" />,
    label: "Manage members",
    link: "/admin/members/individual",
    isAdmin: true,
  },
  {
    icon: <IconAdminCalendar size="20px" />,
    label: "Manage events",
    link: "/admin/events",
    isAdmin: true,
  },
  {
    icon: <IconAdminAward />,
    label: "Manage Trainings",
    link: "/admin/trainings",
    isAdmin: true,
  },
  {
    icon: <IconAdminBriefcase size="20px" />,
    label: "Opportunities",
    link: "/admin/opportunities",
    isAdmin: true,
  },
];

export const MainLinks: React.FC<{ onNavigate: (path: string) => void }> = ({
  onNavigate,
}) => {
  const { isAdmin } = useAuthStore();
  const { pathname } = useLocation();
  const { tabId } = useParams();
  const [adminMode, setMode] = useState<boolean>(pathname.includes("/admin"));

  const navigate = useNavigate();
  const handleChangeMode = (mode: string) => {
    const toAdmin = Boolean(mode === "admin");
    if (adminMode && toAdmin) return;

    var navigateTo = pathname;
    const adminPathname = pathname === "/" ? "/members/individual" : pathname;
    if (toAdmin) {
      navigateTo = "/admin" + adminPathname;
      if (navigateTo.includes("/my"))
        navigateTo = navigateTo.replace(/\/my/, "/");
    } else {
      if (tabId)
        navigateTo = navigateTo.replace(new RegExp(`/${tabId}`, "g"), "");
      navigateTo = navigateTo.replace(/\/admin/g, "");
      if (navigateTo.includes("/members")) {
        navigateTo = "/";
      }
    }

    // If the path is /members/ and we're not in admin mode, go to the home page
    setMode(toAdmin);
    navigate(navigateTo);
  };

  return (
    <Stack spacing={0}>
      {isAdmin && (
        <SegmentedControl
          color="primary"
          value={adminMode ? "admin" : "member"}
          onChange={handleChangeMode}
          data={[
            { label: "Member", value: "member" },
            { label: "Admin", value: "admin" },
          ]}
        />
      )}
      {data
        .filter((d) => Boolean(d.isAdmin) === (isAdmin ? adminMode : false))
        .map((menu, idx) => (
          <MainLink key={idx} {...menu} onNavigate={onNavigate} />
        ))}
    </Stack>
  );
};
