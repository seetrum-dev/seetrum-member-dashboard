import { formatSize } from "@/lib/utils";
import { uploadFile, useFileURLStore } from "@/services/firebase/storage";
import { FileInfo } from "@/types/models/fileInfo";
import { FileRequirement } from "@/types/models/training";
import { FileCard } from "@/ui/Card/FileCard";
import {
  IconAsterisk,
  IconExclamation,
  IconTrash,
  IconUpload,
} from "@/ui/Icons";
import { Typography } from "@/ui/Typography";
import {
  Accordion,
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
import { useRef, useState } from "react";

interface FileUploadButtonProps extends FileRequirement {
  value?: FileInfo;
  onFileChange: (fileInfo?: FileInfo) => any;
  error?: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  title,
  accepts,
  description,
  value: fileInfo,
  maxSize,
  onFileChange,
  required = false,
  error,
}) => {
  const getFileURL = useFileURLStore((s) => s.getFileURL);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [src, setSrc] = useState("");
  const resetRef = useRef<() => void>(null);

  const isImage = accepts.includes("image");

  const removeFile = () => {
    onFileChange(undefined);
    setSrc("");
    resetRef.current?.();
  };

  const submitFile = async (file: File) => {
    try {
      setLoading(true);

      if (file.size > maxSize) {
        open();
        throw Error("File size limit exceeded");
      }

      const newFileInfo = await uploadFile(file, title);
      // console.log(newFileInfo);
      onFileChange(newFileInfo);
      if (isImage) {
        setSrc("");
        getFileURL(newFileInfo.filename).then(setSrc);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        withCloseButton={false}
        opened={opened}
        onClose={close}
        radius={24}
        padding={24}
        centered
        title={
          <Typography textVariant="title-lg">
            File size limit exceeded
          </Typography>
        }
      >
        <Stack spacing={16}>
          <Typography c="dimmed" textVariant="body-md">
            The file you uploaded exceeds the maximum allowed file size of{" "}
            {formatSize(maxSize)}. Please choose a smaller file and try again.
          </Typography>
          <Group position="right">
            <Button size="sm" onClick={close}>
              OK, I understand
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Accordion radius={16} variant="contained">
        <Accordion.Item
          value="file"
          sx={{
            "&[data-active]": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Accordion.Control p={16}>
            <Flex>
              <Typography textVariant="title-md">{title}</Typography>
              {required && (
                <Box ml={3} c="red.3">
                  <IconAsterisk size={8} />
                </Box>
              )}
            </Flex>
          </Accordion.Control>
          <Accordion.Panel
            p={16}
            pt={0}
            sx={{
              ".mantine-Accordion-content": {
                padding: 0,
              },
            }}
          >
            <Flex gap={16}>
              {isImage && (
                <Image
                  src={src}
                  radius={8}
                  withPlaceholder
                  width={90}
                  height={120}
                />
              )}
              <Stack spacing={16}>
                <Typography textVariant="body-md" c="dimmed">
                  {description}
                </Typography>
                {!isImage && fileInfo && (
                  <FileCard onRemoveFile={removeFile} {...fileInfo} />
                )}
                {error && (
                  <Flex c="red.3" align={"center"} gap={8}>
                    <IconExclamation size={16} />
                    <Typography textVariant="body-md">
                      Please provide your {title}
                    </Typography>
                  </Flex>
                )}
                <Group>
                  <FileButton
                    resetRef={resetRef}
                    onChange={submitFile}
                    accept={accepts}
                  >
                    {(props) => (
                      <Button
                        {...props}
                        size="md"
                        variant="outline"
                        c="night"
                        w={!isImage ? "100%" : undefined}
                        loading={loading}
                        sx={(theme) => ({
                          borderColor: theme.fn.rgba(
                            theme.colors.night[6],
                            0.12
                          ),
                        })}
                        leftIcon={<IconUpload size={18} />}
                      >
                        <Typography textVariant="label-lg">
                          Upload {title}
                        </Typography>
                      </Button>
                    )}
                  </FileButton>
                  {isImage && fileInfo && (
                    <Button
                      size="md"
                      loading={loading}
                      onClick={removeFile}
                      variant="outline"
                      c="red"
                      sx={(theme) => ({
                        borderColor: theme.fn.rgba(theme.colors.night[6], 0.12),
                      })}
                      leftIcon={<IconTrash size={18} />}
                    >
                      Remove {title}
                    </Button>
                  )}
                </Group>
              </Stack>
            </Flex>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
