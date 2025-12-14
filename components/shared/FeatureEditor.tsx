"use client";

import { useEffect, useRef, useState } from "react";

interface FeatureEditorProps {
  value?: string[];
  onChange: (features: string[]) => void;
}

export default function FeatureEditor({
  value = [],
  onChange,
}: FeatureEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(value.length === 0);
  const isInitialized = useRef(false);

  // Initialize editor content only once
  useEffect(() => {
    if (!editorRef.current || isInitialized.current) return;

    const content = value.length
      ? `<ul>${value.map((f) => `<li>${f}</li>`).join("")}</ul>`
      : "<ul><li><br></li></ul>";

    editorRef.current.innerHTML = content;
    setIsEmpty(value.length === 0);
    isInitialized.current = true;
  }, [value]);

  // Update features array on input
  const handleInput = () => {
    if (!editorRef.current) return;

    const liElements = editorRef.current.querySelectorAll("li");
    const featuresArray = Array.from(liElements)
      .map((li) => li.textContent?.trim() || "")
      .filter(Boolean);

    setIsEmpty(featuresArray.length === 0);
    onChange(featuresArray);
  };

  // Handle Enter key to add new bullet
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      let container = range.startContainer;

      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentNode as Node;
      }

      const li = (container as Element).closest("li");
      if (!li || !li.parentNode) return;

      const newLi = document.createElement("li");
      newLi.innerHTML = "<br>";

      li.parentNode.insertBefore(newLi, li.nextSibling);

      // Move cursor to new li
      const newRange = document.createRange();
      newRange.setStart(newLi, 0);
      newRange.collapse(true);

      sel.removeAllRanges();
      sel.addRange(newRange);

      handleInput(); // Update state immediately
    }
  };

  return (
    <div className="w-full relative">
      {/* Placeholder */}
      {isEmpty && (
        <span className="absolute top-2 left-4 text-gray-400 pointer-events-none select-none">
          Type a feature...
        </span>
      )}

      <div
        ref={editorRef}
        className="w-full rounded-md border p-2 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 list-disc pl-6"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
