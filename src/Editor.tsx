import { $getRoot, $getSelection, EditorState } from "lexical";
import { useEffect, useRef } from "react";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const theme = {
  // Theme styling goes here
  // ...
};

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function Save() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        console.log(editorState);
      }
    );
    return removeUpdateListener();
  }, [editor]);

  return null;
}

function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };
  const editorStateRef = useRef<EditorState>();

  useEffect(() => {
    console.log(editorStateRef.current?.toJSON());
  }, [editorStateRef.current]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin
        onChange={(editorState) => (editorStateRef.current = editorState)}
      />
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
      <Save />
    </LexicalComposer>
  );
}

export default Editor;
