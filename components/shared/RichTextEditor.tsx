"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ListItem from "@tiptap/extension-list-item";
import ImageExtension from "@tiptap/extension-image";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Code as CodeIcon,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Image as ImageIcon,
} from "lucide-react";

import { useUploadThing } from "@/lib/uploadthing";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const RichTextEditor = ({ value, onChange }: Props) => {
  const { startUpload } = useUploadThing("imageUploader");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true }),
      Code,
      CodeBlock,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Blockquote,
      HorizontalRule,
      ListItem,
      ImageExtension.configure({ inline: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[200px] border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  // Image insert with preview and upload
  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Show preview using base64
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);

      // Confirm before uploading
      const confirmUpload = confirm("Do you want to insert this image?");
      if (!confirmUpload) {
        setPreviewImage(null);
        return;
      }

      try {
        const uploaded = await startUpload([file]);
        if (uploaded && uploaded[0]) {
          editor.chain().focus().setImage({ src: uploaded[0].url }).run();
        }
      } catch (error) {
        console.error("Image upload failed", error);
        alert("Failed to upload image. Try again.");
      } finally {
        setPreviewImage(null);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border px-2 py-1 rounded-md bg-gray-50">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${
            editor.isActive("bold") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          <Bold size={18} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${
            editor.isActive("italic") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          <Italic size={18} />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded ${
            editor.isActive("underline") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          U
        </button>

        {/* Strike */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 rounded ${
            editor.isActive("strike") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          <Strikethrough size={18} />
        </button>

        {/* Code Inline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1 rounded ${
            editor.isActive("code") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          <CodeIcon size={18} />
        </button>

        {/* Highlight */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1 rounded ${
            editor.isActive("highlight") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          H
        </button>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${
            editor.isActive("bulletList") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded ${
            editor.isActive("orderedList")
              ? "bg-indigo-100 text-indigo-600"
              : ""
          }`}
        >
          <ListOrdered size={18} />
        </button>

        {/* Text Align */}
        {["left", "center", "right", "justify"].map((align) => {
          const Icon =
            align === "left"
              ? AlignLeft
              : align === "center"
              ? AlignCenter
              : align === "right"
              ? AlignRight
              : AlignJustify;
          return (
            <button
              key={align}
              type="button"
              onClick={() => editor.chain().focus().setTextAlign(align).run()}
              className={`p-1 rounded ${
                editor.isActive({ textAlign: align })
                  ? "bg-indigo-100 text-indigo-600"
                  : ""
              }`}
            >
              <Icon size={18} />
            </button>
          );
        })}

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (!url) return;
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          className={`p-1 rounded ${
            editor.isActive("link") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          <LinkIcon size={18} />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="p-1 rounded hover:bg-gray-100"
        >
          <ImageIcon size={18} />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded ${
            editor.isActive("blockquote") ? "bg-indigo-100 text-indigo-600" : ""
          }`}
        >
          <Quote size={18} />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1 rounded"
        >
          <Minus size={18} />
        </button>

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1 rounded"
        >
          <Undo2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1 rounded"
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Preview using Next.js Image */}
      {previewImage && (
        <div className="border rounded-md p-2 bg-gray-50">
          <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
          <div className="relative w-full h-[200px]">
            <Image
              src={previewImage}
              alt="Preview"
              fill
              className="object-contain rounded-md"
            />
          </div>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} className="tiptap-editor" />

      <style jsx>{`
        .tiptap-editor a {
          @apply text-blue-600 underline;
        }
        .tiptap-editor img {
          @apply max-w-full rounded-md my-2;
        }
      `}</style>
    </div>
  );
};
