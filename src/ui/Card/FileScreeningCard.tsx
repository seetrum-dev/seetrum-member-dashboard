import { ActionIcon, Flex, Stack, Tooltip } from "@mantine/core";
import {
  IconJPG,
  IconPDF,
  IconBoxArrowUpRight,
  IconDownload,
  IconTrash,
} from "../Icons";
import { FileInfo } from "@/types/models/fileInfo";
import { Typography } from "../Typography";
import { useFileURLStore } from "@/services/firebase/storage";
import { showErrorNotif } from "../notifications";
import { kLineClamp } from "@/lib/utils";

export const FileScreeningCard = (
  fileInfo: FileInfo & {
    showTag?: boolean;
    withDownload?: boolean;
    onDelete?: () => Promise<void> | void;
  }
) => {
  const getFileURL = useFileURLStore((s) => s.getFileURL);

  const handleOpenFile = async (filename: string) => {
    try {
      const url = await getFileURL(filename);
      window.open(url, "_blank");
    } catch (e) {
      showErrorNotif({ message: "Error in fetching file URL" });
    }
  };

  return (
    <Flex gap={12} w={"100%"} align={"center"}>
      <Flex
        w={32}
        h={32}
        align={"center"}
        justify={"center"}
        sx={(t) => ({
          alignContent: "center",
          borderRadius: 8,
          border: "1px solid",
          color: t.colors.red[6],
          borderColor: t.fn.rgba(t.colors.night[5], 0.12),
        })}
      >
        {fileInfo.contentType.includes("pdf") ? (
          <IconPDF size={22} />
        ) : (
          <IconJPG size={22} />
        )}
      </Flex>
      <Tooltip
        withArrow
        label={fileInfo.filename.split("-").slice(1).join("-")}
        multiline
        sx={{ overflowWrap: "anywhere" }}
        maw={300}
        position="top-start"
        openDelay={250}
        transitionProps={{ transition: "pop", duration: 300 }}
      >
        <Stack spacing={0} sx={{ flex: 1, cursor: "default" }}>
          {fileInfo.showTag && (
            <Typography textVariant="body-lg">{fileInfo.tag}</Typography>
          )}
          <Typography
            textVariant={fileInfo.showTag ? "body-sm" : "body-md"}
            sx={{ ...kLineClamp(fileInfo.showTag ? 1 : 2) }}
          >
            {fileInfo.filename.split("-").slice(1).join("-")}
          </Typography>
        </Stack>
      </Tooltip>
      <Flex gap={8}>
        <ActionIcon
          w={30}
          h={30}
          c="night"
          onClick={(e) => handleOpenFile(fileInfo.filename)}
        >
          <IconBoxArrowUpRight size={18} />
        </ActionIcon>
        {fileInfo.withDownload && (
          <ActionIcon w={30} h={30} c="night">
            <IconDownload size={18} />
          </ActionIcon>
        )}
        {fileInfo.onDelete && (
          <ActionIcon
            w={30}
            h={30}
            c="red"
            onClick={(e) => fileInfo.onDelete && fileInfo.onDelete()}
          >
            <IconTrash size={18} />
          </ActionIcon>
        )}
      </Flex>
    </Flex>
  );
};
