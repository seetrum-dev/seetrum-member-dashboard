import { updateTraining } from "@/modules/trainings/services/trainingService";
import { useTrainings } from "@/modules/trainings/store/useTrainings";
import { uploadFile, useFileURLStore } from "@/services/firebase/storage";
import { Typography } from "@/ui/Typography";
import {
  Box,
  Button,
  FileButton,
  Flex,
  Group,
  Image,
  Modal,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const ThumbnailPicker: React.FC = () => {
  const { id } = useParams();
  const getTrainingsById = useTrainings((t) => t.getTrainingsById);
  const updatePartialTraining = useTrainings((t) => t.updatePartialTraining);
  const [imgUrl, setImgUrl] = useState("");
  const getFileURL = useFileURLStore((f) => f.getFileURL);

  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const resetRef = useRef<() => void>(null);

  useEffect(() => {
    if (id) {
      const getInitialImage = async () => {
        const t = await getTrainingsById(id);

        if (t?.thumbnailFileName) {
          const url = await getFileURL(t.thumbnailFileName);
          setImgUrl(url);
        }
      };

      getInitialImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const removeFile = () => {
    setImgUrl("");
    resetRef.current?.();
    handleUpdateTraining("");
  };

  const submitFile = async (file: File) => {
    try {
      setLoading(true);

      // Check 5MB
      if (file.size > 5 * 1024 ** 2) {
        open();
        throw Error("File size limit exceeded");
      }

      const { filename } = await uploadFile(file, "");

      handleUpdateTraining(filename);
      setImgUrl("");
      getFileURL(filename).then(setImgUrl);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleUpdateTraining = async (filename: string) => {
    try {
      await updateTraining(id!, {
        thumbnailFileName: filename,
      });
      updatePartialTraining(id!, { thumbnailFileName: filename });
    } catch (error) {
      throw error;
    }
  };

  return (
    <Stack
      spacing={16}
      px={16}
      pt={24}
      pb={20}
      sx={(thm) => ({
        borderRadius: 16,
        border: "1px solid",
        borderColor: thm.fn.rgba(thm.colors.night[5], 0.12),
      })}
    >
      <ConfirmationModal opened={opened} onClose={close} />
      <Typography textVariant="title-lg">Thumbnail Photo</Typography>
      <Flex gap={16}>
        <Image
          src={imgUrl}
          withPlaceholder
          height={140}
          sx={(t: any) => ({
            maxWidth: 210,
            flexShrink: 0,
            [t.fn.smallerThan("sm")]: {
              maxWidth: "45%",
              ".mantine-Image-imageWrapper img": {
                maxWidth: "100%",
                objectPosition: "50% 50%",
              },
            },
            minWidth: 180,
            overflow: "hidden",
            borderRadius: "16px",
            border: "1px solid",
            borderColor: t.fn.rgba(t.colors.night[6], 0.08),
          })}
        />
        <Box>
          <Typography textVariant="body-md">
            You can upload images in PNG or JPEG format with a maximum file size
            of 5MB.
          </Typography>
          <Group mt={16} spacing={8}>
            <FileButton
              resetRef={resetRef}
              onChange={submitFile}
              accept={"image/png,image/jpeg"}
            >
              {(props) => (
                <Button {...props} variant="outline" loading={loading}>
                  {imgUrl ? "Edit Photo" : "Upload Photo"}
                </Button>
              )}
            </FileButton>
            {imgUrl && (
              <Button onClick={removeFile} c="red" variant="subtle">
                Delete Photo
              </Button>
            )}
          </Group>
        </Box>
      </Flex>
    </Stack>
  );
};

interface ModalProps {
  opened: boolean;
  onClose(): void;
}
export const ConfirmationModal: React.FC<ModalProps> = ({
  opened,
  onClose,
}) => {
  return (
    <Modal
      withCloseButton={false}
      opened={opened}
      onClose={onClose}
      radius={24}
      padding={24}
      centered
      title={
        <Typography textVariant="title-lg">File size limit exceeded</Typography>
      }
    >
      <Stack spacing={16}>
        <Typography c="dimmed" textVariant="body-md">
          The file you uploaded exceeds the maximum allowed file size of 5 MB.
          Please choose a smaller file and try again.
        </Typography>
        <Group position="right">
          <Button size="sm" onClick={onClose}>
            OK, I understand
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
