import { BLUR_COMMAND, COMMAND_PRIORITY_NORMAL } from "lexical";
import { useEffect, useRef } from "react";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const theme = {
  // Theme styling goes here
  // ...
};

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function onError(error: Error) {
  console.error(error);
}

function CustomOnChangePlugin() {
  const [editor] = useLexicalComposerContext();
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return editor.registerCommand(
      BLUR_COMMAND,
      () => {
        if (timer.current) clearTimeout(timer.current);
        console.log("blur!!!");
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        console.log("timer in onchange: ", timer.current);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          console.log("onChange!!!");
        }, 3000);
      }
    );
    // return removeUpdateListener();
  }, [editor]);

  return null;
}

function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
      <CustomOnChangePlugin />
    </LexicalComposer>
  );
}

export default Editor;
