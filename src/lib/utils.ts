import { matches } from "@mantine/form";

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const extractInitials = (name: string) => {
  const words = name.trim().split(" ");
  let initials = "";

  for (let i = 0; i < words.length && initials.length < 2; i++) {
    initials += words[i].charAt(0);
  }

  return initials.toUpperCase();
};

export const pretyDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const pretyDateTime = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const yyyymmddDateFormater = (date: Date) => {
  const dt = new Date(date);
  return dt.toISOString().slice(0, 10).replace(/-/g, "");
};

export const formatSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1048576) {
    const kilobytes = (bytes / 1024).toFixed(2);
    return kilobytes + " KB";
  } else {
    const megabytes = (bytes / 1048576).toFixed(2);
    return megabytes + " MB";
  }
};

export const getFileName = (filename: string) => {
  return filename.split("-").slice(1).join("-");
};

export const isIDNPhoneNumber = (errorMessage: string) => {
  return (value: unknown) =>
    matches(
      /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/,
      errorMessage
    )(value);
};

export const kLineClamp = (n: number): React.CSSProperties & any => ({
  wordBreak: "break-all",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: n.toString(),
  WebkitBoxOrient: "vertical",
});

export const isMeetingLink = (string?: string): boolean => {
  if (!string) return false;
  const urlRegex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;
  const isUrl = urlRegex.test(string);
  if (!isUrl) return false;
  const meetingServices = [
    "zoom",
    "teams",
    "meet.google",
    "webex",
    "gotomeeting",
    "bluejeans",
    "join.me",
  ];
  const mapsServices = ["google.com/maps", "maps.google"];
  const isMeetingService = meetingServices.some((service) =>
    string.includes(service)
  );
  const isMapsService = mapsServices.some((service) =>
    string.includes(service)
  );
  return isMeetingService && !isMapsService;
};

export const mergeObjects = <T extends object>(
  arr: T[]
): Record<keyof T, any> => {
  return arr.reduce((result, obj) => {
    Object.keys(obj).forEach((key) => {
      result[key as keyof T] = obj[key as keyof T];
    });
    return result;
  }, {} as Record<keyof T, any>);
};
