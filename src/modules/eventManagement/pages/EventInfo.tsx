import { updateScheduledEvent } from "@/modules/event/services/eventService";
import { useEventDetail } from "@/modules/event/store/useEventDetail";
import { useEventsList } from "@/modules/event/store/useEventList";
import { ConfirmationModal } from "@/modules/trainings/pages/manageTrainings/info/ThumbnailPicker";
import { uploadFile, useFileURLStore } from "@/services/firebase/storage";
import { Typography } from "@/ui/Typography";
import { Button, FileButton, Flex, Image, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const ManageEventInfo = () => {
  return (
    <Stack spacing={24}>
      {/* Info */}
      {/* <EventGeneralInfo /> */}
      {/* Thumbnail */}
      <EventThumbnailEditor />
    </Stack>
  );
};

const EventThumbnailEditor = () => {
  const { id } = useParams();
  const { getEvent, event, loading, revalidate } = useEventDetail();
  const { setValidStatus: setEventListValidStatus } = useEventsList();
  const [updateLoading, setLoading] = useState(false);
  const [imgSrc, setImage] = useState("");
  const getFileURL = useFileURLStore((s) => s.getFileURL);
  const [opened, { open, close }] = useDisclosure(false);

  const resetRef = useRef<() => void>(null);

  const submitFile = async (file: File) => {
    try {
      setLoading(true);

      // Check 5MB
      if (file.size > 5 * 1024 ** 2) {
        open();
        throw Error("File size limit exceeded");
      }

      const { filename } = await uploadFile(file, "");

      handleUpdateEvent(filename);
      setImage("");
      getFileURL(filename).then(setImage);
      revalidate();
      setEventListValidStatus(false);
      resetRef.current?.();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleUpdateEvent = async (filename: string) => {
    try {
      await updateScheduledEvent(id!, {
        thumbnailFileName: filename,
      });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    id && getEvent(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    event?.thumbnailFileName &&
      getFileURL(event?.thumbnailFileName).then(setImage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.thumbnailFileName]);

  return (
    <Stack
      p={16}
      pb={20}
      maw={"min(100%, 684px)"}
      sx={(t) => ({
        borderRadius: 16,
        border: "1px solid",
        borderColor: t.fn.rgba(t.colors.night[5], 0.12),
      })}
    >
      <ConfirmationModal
        opened={opened}
        onClose={() => {
          close();
        }}
      />
      <Typography textVariant="title-lg">Thumbnail Photo</Typography>
      <Flex gap={16}>
        <Image
          withPlaceholder
          src={imgSrc}
          width={200}
          height={225}
          alt="Event thumbnail"
          sx={(t) => ({
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid",
            borderColor: t.fn.rgba(t.colors.night[5], 0.12),
          })}
        />
        <Stack sx={{ flex: 1 }}>
          <Typography color="dimmed">
            You can upload images in PNG or JPEG format with a maximum file size
            of 5MB.
          </Typography>
          <FileButton
            resetRef={resetRef}
            onChange={submitFile}
            accept={"image/png,image/jpeg"}
          >
            {(props) => (
              <Button
                {...props}
                radius={8}
                variant="outline"
                w={"fit-content"}
                sx={(t) => ({
                  borderColor: t.fn.rgba(t.colors.night[5], 0.12),
                })}
                loading={loading || updateLoading}
              >
                {event?.thumbnailFileName ? "Edit photo" : "Add photo"}
              </Button>
            )}
          </FileButton>
        </Stack>
      </Flex>
    </Stack>
  );
};
