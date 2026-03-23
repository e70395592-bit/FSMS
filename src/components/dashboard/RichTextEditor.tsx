import { useEditor, EditorContent, Extension } from '@tiptap/react'
import { useEffect, useCallback } from 'react'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    direction: {
      setDirection: (direction: string) => ReturnType,
      unsetDirection: () => ReturnType,
    }
  }
}

import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Underline as UnderlineIcon,
  Undo,
  Redo,
  Link as LinkIcon,
  Table as TableIcon,
  CheckSquare,
  Quote,
  Code,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Strikethrough,
  Trash2,
  Rows,
  Columns,
  Type,
  Languages,
  ArrowLeftToLine,
  ArrowRightToLine
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DirectionOptions {
  types: string[],
  directions: string[],
  defaultDirection: string,
}

// Custom Direction Extension
const Direction = Extension.create<DirectionOptions>({
  name: 'direction',
  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      directions: ['ltr', 'rtl', 'auto'],
      defaultDirection: 'auto',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: this.options.defaultDirection,
            parseHTML: element => element.getAttribute('dir'),
            renderHTML: attributes => {
              if (!attributes.dir) {
                return {}
              }
              return { dir: attributes.dir }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setDirection: (direction: string) => ({ commands }) => {
        return this.options.types.every(type => (commands as any).updateAttributes(type, { dir: direction }))
      },
      unsetDirection: () => ({ commands }) => {
        return this.options.types.every(type => (commands as any).resetAttributes(type, 'dir'))
      },
    } as any
  },
})

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  isAr?: boolean
  placeholder?: string
}

const MenuBar = ({ editor, isAr }: { editor: any; isAr: boolean }) => {
  if (!editor) {
    return null
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    tooltip 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode;
    tooltip: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "h-8 w-8 p-0",
              isActive && 'bg-accent text-accent-foreground'
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className={cn(
      "flex flex-wrap items-center gap-0.5 p-1 border-b border-border/50 bg-muted/20 rounded-t-xl",
      isAr ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Formatting */}
      <div className="flex items-center gap-0.5 px-1 border-x border-border/40 first:border-l-0 last:border-r-0">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          tooltip={isAr ? "خط عريض" : "Bold"}
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          tooltip={isAr ? "خط مائل" : "Italic"}
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          tooltip={isAr ? "تسطير" : "Underline"}
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          tooltip={isAr ? "يتوسطه خط" : "Strikethrough"}
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-0.5 px-1 border-x border-border/40">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          tooltip={isAr ? "عنوان 1" : "Heading 1"}
        >
          <Heading1 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          tooltip={isAr ? "عنوان 2" : "Heading 2"}
        >
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          tooltip={isAr ? "عنوان 3" : "Heading 3"}
        >
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Direction */}
      <div className="flex items-center gap-0.5 px-1 border-x border-border/40">
        <ToolbarButton
          onClick={() => editor.chain().focus().setDirection('ltr').run()}
          isActive={editor.getAttributes('paragraph').dir === 'ltr' || editor.getAttributes('heading').dir === 'ltr'}
          tooltip={isAr ? "نص من اليسار لليمين" : "Left to Right"}
        >
          <ArrowRightToLine className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setDirection('rtl').run()}
          isActive={editor.getAttributes('paragraph').dir === 'rtl' || editor.getAttributes('heading').dir === 'rtl'}
          tooltip={isAr ? "نص من اليمين لليسار" : "Right to Left"}
        >
          <ArrowLeftToLine className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Lists & Blocks */}
      <div className="flex items-center gap-0.5 px-1 border-x border-border/40">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          tooltip={isAr ? "قائمة نقطية" : "Bullet List"}
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          tooltip={isAr ? "قائمة مرقمة" : "Ordered List"}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          tooltip={isAr ? "قائمة مهام" : "Task List"}
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          tooltip={isAr ? "اقتباس" : "Blockquote"}
        >
          <Quote className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          tooltip={isAr ? "مقطع برمجية" : "Code Block"}
        >
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-1 border-x border-border/40">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          tooltip={isAr ? "محاذاة لليسار" : "Align Left"}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          tooltip={isAr ? "محاذاة للوسط" : "Align Center"}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          tooltip={isAr ? "محاذاة لليمين" : "Align Right"}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Tables */}
      <div className="flex items-center gap-0.5 px-1 border-x border-border/40">
        <ToolbarButton
          onClick={addTable}
          tooltip={isAr ? "إدراج جدول" : "Insert Table"}
        >
          <TableIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        {editor.isActive('table') && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              tooltip={isAr ? "إضافة صف" : "Add Row"}
            >
              <Rows className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              tooltip={isAr ? "إضافة عمود" : "Add Column"}
            >
              <Columns className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              tooltip={isAr ? "حذف الجدول" : "Delete Table"}
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </ToolbarButton>
          </>
        )}
      </div>

      {/* Advanced */}
      <div className="flex items-center gap-0.5 px-1 border-x border-border/40">
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          tooltip={isAr ? "إضافة رابط" : "Add Link"}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          tooltip={isAr ? "تمييز" : "Highlight"}
        >
          <Highlighter className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          tooltip={isAr ? "نص منخفض" : "Subscript"}
        >
          <SubscriptIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          tooltip={isAr ? "نص مرتفع" : "Superscript"}
        >
          <SuperscriptIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
          title={isAr ? "لون الخط" : "Text Color"}
        />
      </div>

      <div className="flex-grow" />

      {/* History */}
      <div className="flex items-center gap-0.5 px-1 border-x border-border/40">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          tooltip={isAr ? "تراجع" : "Undo"}
        >
          <Undo className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          tooltip={isAr ? "إعادة" : "Redo"}
        >
          <Redo className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>
    </div>
  )
}

export const RichTextEditor = ({ content, onChange, isAr = true, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Direction,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4 border border-border/50',
        },
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border/50 p-2 text-sm relative min-w-[50px]',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Subscript,
      Superscript,
      Placeholder.configure({
        placeholder: placeholder || (isAr ? 'ابدأ الكتابة هنا...' : 'Start typing here...'),
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[500px] p-6",
          isAr ? "text-right" : "text-left"
        ),
      },
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="w-full border border-border/50 rounded-xl bg-card overflow-hidden shadow-sm">
      <MenuBar editor={editor} isAr={isAr} />
      <EditorContent editor={editor} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        .ProseMirror td, .ProseMirror th {
          min-width: 1em;
          border: 1px solid #ddd;
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f8f9fa;
        }
        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          z-index: 20;
          background-color: #adf;
          pointer-events: none;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
          margin-top: 0.3rem;
          cursor: pointer;
        }
        
        /* Direction support */
        .ProseMirror [dir="rtl"] {
          direction: rtl;
          text-align: right;
        }
        .ProseMirror [dir="ltr"] {
          direction: ltr;
          text-align: left;
        }
      ` }} />
    </div>
  )
}

