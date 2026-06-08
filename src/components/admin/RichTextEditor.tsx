'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Terminal,
  Minus,
  Link as LucideLink,
  Image as LucideImage,
  Undo,
  Redo
} from 'lucide-react';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image,
      Link.configure({ openOnClick: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        'data-placeholder': placeholder,
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = prompt('Image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = prompt('Link URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded text-sm font-medium transition-all hover:bg-muted cursor-pointer flex items-center justify-center ${
      isActive
        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30 shadow-sm'
        : 'text-muted-foreground hover:text-foreground border border-transparent'
    }`;

  return (
    <div className="border border-border rounded-md overflow-hidden bg-card focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20">
      <div className="flex flex-wrap gap-1 p-2 bg-muted/40 border-b border-border">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))} title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))} title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))} title="Strike">
          <Strikethrough className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={buttonClass(editor.isActive('code'))} title="Inline Code">
          <Code className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass(editor.isActive('heading', { level: 1 }))} title="Heading 1">
          <Heading1 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass(editor.isActive('heading', { level: 3 }))} title="Heading 3">
          <Heading3 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))} title="Bullet List">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))} title="Ordered List">
          <ListOrdered className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass(editor.isActive('blockquote'))} title="Blockquote">
          <Quote className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={buttonClass(editor.isActive('codeBlock'))} title="Code Block">
          <Terminal className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={buttonClass(false)} title="Horizontal Rule">
          <Minus className="w-4 h-4" />
        </button>
        <button type="button" onClick={setLink} className={buttonClass(editor.isActive('link'))} title="Insert Link">
          <LucideLink className="w-4 h-4" />
        </button>
        <button type="button" onClick={addImage} className={buttonClass(false)} title="Insert Image">
          <LucideImage className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={buttonClass(false)} title="Undo">
          <Undo className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={buttonClass(false)} title="Redo">
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <div className="prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
