import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

interface RichTextEditorFieldParams {
  editor: Editor | null;
}

export const RichTextEditorField: React.FC<RichTextEditorFieldParams> = ({
  editor,
}) => {
  return (
    <RichTextEditor editor={editor} sx={{ borderRadius: 8 }}>
      <RichTextEditor.Toolbar
        sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        sticky
        stickyOffset={60}
      >
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content sx={{ borderRadius: 8 }} />
    </RichTextEditor>
  );
};
