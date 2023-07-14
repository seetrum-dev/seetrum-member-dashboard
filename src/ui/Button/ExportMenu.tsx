import { ActionIcon, Button, Flex, Menu, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ExportToCsv, Options } from "export-to-csv";
import { IconSave } from "../Icons";
import { yyyymmddDateFormater } from "@/lib/utils";

// Constants for configuration
const today = new Date(Date.now());
const csvOptions = (filename?: string): Options => ({
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true,
  filename: `${yyyymmddDateFormater(today)}-seetrum-${
    filename || "generatedData"
  }`,
});

// Types and interfaces
type Exporter = <T extends object>(data: T[]) => void;

interface ExportMenuProps {
  exportAllRef: React.RefObject<HTMLButtonElement>;
  exportRowsRef: React.RefObject<HTMLButtonElement>;
}

interface TablePseudoExportButtonProps {
  exportAllRef: React.RefObject<HTMLButtonElement>;
  exportRowsRef: React.RefObject<HTMLButtonElement>;
  onExportAll: (exporter: Exporter) => void;
  onExportRows: (exporter: Exporter) => void;
  filenames?: string;
}

// Components
/**
 * ExportMenu Button that will display menu options for exporting data
 * @example
 * <ExportMenu
 *   exportAllRef={buttonRef}
 *   exportRowsRef={button2Ref}
 * />
 */
export const ExportMenu = ({
  exportAllRef,
  exportRowsRef,
}: ExportMenuProps) => {
  const t = useMantineTheme();
  const isMobile = useMediaQuery(t.fn.smallerThan("sm").replace("@media ", ""));

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        {isMobile ? (
          <ActionIcon variant="filled" radius={8} color="primary" size={32}>
            <IconSave size={12} />
          </ActionIcon>
        ) : (
          <Button leftIcon={<IconSave size={14} />} radius={8}>
            Export data{" "}
          </Button>
        )}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (exportAllRef.current) exportAllRef.current.click();
          }}
        >
          All data
        </Menu.Item>
        <Menu.Item
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (exportRowsRef.current) exportRowsRef.current.click();
          }}
        >
          All current rows
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

/**
 * `TablePseudoExportButton` is hiddens component that responsible for triggering export.
 *
 * Use this component on `renderTopToolbarCustomActions()` method
 */
export const TablePseudoExportButton: React.FC<
  TablePseudoExportButtonProps
> = ({ exportAllRef, exportRowsRef, onExportRows, onExportAll, filenames }) => {
  const csvExporter = new ExportToCsv(csvOptions(filenames));
  const exporter = <T extends object>(data: T[]) => {
    csvExporter.generateCsv(data);
  };

  const handleEventBubble = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <Flex display={"none"}>
      <Button
        ref={exportAllRef}
        onClick={(e) => {
          handleEventBubble(e);
          onExportAll(exporter);
        }}
      />
      <Button
        ref={exportRowsRef}
        onClick={(e) => {
          handleEventBubble(e);
          onExportRows(exporter);
        }}
      />
    </Flex>
  );
};
