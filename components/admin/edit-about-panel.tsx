'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  IconPlus,
  IconX,
  IconBold,
  IconItalic,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconLink,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconGripVertical,
} from '@tabler/icons-react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SlideOver } from '@/components/admin/slide-over'
import { EditButton } from '@/components/admin/edit-button'
import { Button } from '@/components/ui/button'
import { updateAbout } from '@/app/actions/admin'
import type { QuickFact } from '@/types/database'
import type { Database } from '@/types/database'

type AboutRow = Database['public']['Tables']['about']['Row']

interface EditAboutLayerProps {
  initialData: AboutRow | null
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface FactItem {
  id: string
  label: string
  value: string
}

// ─── Toolbar button ──────────────────────────────────────────────────────────

function ToolbarBtn({
  onClick,
  active,
  disabled,
  'aria-label': ariaLabel,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  'aria-label': string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={[
        'flex items-center justify-center w-7 h-7 rounded-[4px]',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma',
        active
          ? 'text-bone bg-[rgba(139,146,165,0.15)]'
          : 'text-ash hover:text-bone',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

// ─── Tiptap toolbar ──────────────────────────────────────────────────────────

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', prev ?? '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border border-[rgba(139,146,165,0.2)] border-b-0 rounded-t-[12px] bg-carbon sticky top-0 z-10">
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        aria-label="Bold"
      >
        <IconBold size={14} stroke={1.5} />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        aria-label="Italic"
      >
        <IconItalic size={14} stroke={1.5} />
      </ToolbarBtn>

      <span className="w-px h-4 bg-[rgba(139,146,165,0.2)] mx-0.5" aria-hidden="true" />

      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        aria-label="Heading 2"
      >
        <IconH2 size={14} stroke={1.5} />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        aria-label="Heading 3"
      >
        <IconH3 size={14} stroke={1.5} />
      </ToolbarBtn>

      <span className="w-px h-4 bg-[rgba(139,146,165,0.2)] mx-0.5" aria-hidden="true" />

      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        aria-label="Bullet list"
      >
        <IconList size={14} stroke={1.5} />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        aria-label="Ordered list"
      >
        <IconListNumbers size={14} stroke={1.5} />
      </ToolbarBtn>

      <span className="w-px h-4 bg-[rgba(139,146,165,0.2)] mx-0.5" aria-hidden="true" />

      <ToolbarBtn
        onClick={setLink}
        active={editor.isActive('link')}
        aria-label="Link"
      >
        <IconLink size={14} stroke={1.5} />
      </ToolbarBtn>

      <span className="w-px h-4 bg-[rgba(139,146,165,0.2)] mx-0.5" aria-hidden="true" />

      <ToolbarBtn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        aria-label="Undo"
      >
        <IconArrowBackUp size={14} stroke={1.5} />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        aria-label="Redo"
      >
        <IconArrowForwardUp size={14} stroke={1.5} />
      </ToolbarBtn>
    </div>
  )
}

// ─── Sortable fact row ────────────────────────────────────────────────────────

function SortableFactRow({
  fact,
  index,
  onChange,
  onRemove,
}: {
  fact: FactItem
  index: number
  onChange: (id: string, field: 'label' | 'value', val: string) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: fact.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const inputClass =
    'flex-1 bg-midnight text-bone text-[13px] leading-[1.7] px-3 py-2 rounded-[8px] border border-[rgba(139,146,165,0.2)] placeholder:text-ash focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma transition-colors duration-150 min-w-0'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2"
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reorder fact ${index + 1}`}
        className="flex items-center justify-center w-5 h-5 text-ash hover:text-bone transition-colors duration-150 shrink-0 cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma rounded-[4px]"
      >
        <IconGripVertical size={14} stroke={1.5} />
      </button>

      <input
        type="text"
        placeholder="Label"
        value={fact.label}
        onChange={(e) => onChange(fact.id, 'label', e.target.value)}
        aria-label={`Fact ${index + 1} label`}
        className={inputClass}
      />
      <input
        type="text"
        placeholder="Value"
        value={fact.value}
        onChange={(e) => onChange(fact.id, 'value', e.target.value)}
        aria-label={`Fact ${index + 1} value`}
        className={inputClass}
      />

      <button
        type="button"
        onClick={() => onRemove(fact.id)}
        aria-label={`Remove fact ${index + 1}`}
        className="flex items-center justify-center w-6 h-6 text-ash hover:text-bone transition-colors duration-150 shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma rounded-[4px]"
      >
        <IconX size={14} stroke={1.5} />
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EditAboutLayer({ initialData }: EditAboutLayerProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'bio' | 'facts'>('bio')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const initialFacts: FactItem[] = Array.isArray(initialData?.quick_facts)
    ? (initialData.quick_facts as QuickFact[]).map((f, i) => ({
        id: String(i),
        label: f.label,
        value: f.value,
      }))
    : []

  const [facts, setFacts] = useState<FactItem[]>(initialFacts)

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const editor = useEditor({
    // immediatelyRender: false prevents the SSR-detection warning because
    // Next.js SSR will attempt to render this component on the server.
    immediatelyRender: false,
    extensions: [
      // Disable StarterKit's bundled link to avoid duplicate extension names
      // when we register the explicit Link extension below.
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Tell your story…' }),
    ],
    content: initialData?.content ?? '',
    editorProps: {
      attributes: {
        class: 'prose-editor',
      },
    },
  })

  const openPanel = useCallback(() => {
    // Reset to current DB values
    editor?.commands.setContent(initialData?.content ?? '')
    const freshFacts: FactItem[] = Array.isArray(initialData?.quick_facts)
      ? (initialData.quick_facts as QuickFact[]).map((f, i) => ({
          id: String(i),
          label: f.label,
          value: f.value,
        }))
      : []
    setFacts(freshFacts)
    setActiveTab('bio')
    setOpen(true)
  }, [editor, initialData])

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setFacts((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id)
        const newIndex = prev.findIndex((f) => f.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const handleFactChange = (id: string, field: 'label' | 'value', val: string) => {
    setFacts((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: val } : f)))
  }

  const handleFactRemove = (id: string) => {
    setFacts((prev) => prev.filter((f) => f.id !== id))
  }

  const handleAddFact = () => {
    if (facts.length >= 8) return
    setFacts((prev) => [
      ...prev,
      { id: `${Date.now()}`, label: '', value: '' },
    ])
  }

  const handleSave = async () => {
    if (!editor) return
    setIsSaving(true)
    const result = await updateAbout({
      content: editor.getHTML(),
      quick_facts: facts
        .filter((f) => f.label.trim() || f.value.trim())
        .map(({ label, value }) => ({ label, value })),
    })
    setIsSaving(false)
    if (result.success) {
      toast.success('Updated.')
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const footer = (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(false)}
        disabled={isSaving}
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving…' : 'Save'}
      </Button>
    </>
  )

  const tabClass = (tab: 'bio' | 'facts') =>
    [
      'px-3 py-1.5 text-[12px] font-mono rounded-[6px] transition-colors duration-150',
      'focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma',
      activeTab === tab
        ? 'bg-[rgba(139,146,165,0.15)] text-bone'
        : 'text-ash hover:text-bone',
    ].join(' ')

  return (
    <>
      <EditButton aria-label="Edit about" onClick={openPanel} variant="inline" />

      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Edit about"
        footer={footer}
        titleId="about-edit-title"
      >
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="About editor tabs"
          className="flex gap-1 mb-5"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'bio'}
            aria-controls="tab-panel-bio"
            id="tab-bio"
            type="button"
            onClick={() => setActiveTab('bio')}
            className={tabClass('bio')}
          >
            Bio
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'facts'}
            aria-controls="tab-panel-facts"
            id="tab-facts"
            type="button"
            onClick={() => setActiveTab('facts')}
            className={tabClass('facts')}
          >
            Quick facts
          </button>
        </div>

        {/* Bio tab */}
        <div
          role="tabpanel"
          id="tab-panel-bio"
          aria-labelledby="tab-bio"
          hidden={activeTab !== 'bio'}
        >
          {mounted ? (
            <>
              <EditorToolbar editor={editor} />
              <EditorContent
                editor={editor}
                className="border border-[rgba(139,146,165,0.2)] border-t-0 rounded-b-[12px] overflow-hidden"
              />
            </>
          ) : (
            <div
              className="border border-[rgba(139,146,165,0.2)] rounded-[12px] bg-transparent"
              style={{ minHeight: 320 }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Quick facts tab */}
        <div
          role="tabpanel"
          id="tab-panel-facts"
          aria-labelledby="tab-facts"
          hidden={activeTab !== 'facts'}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={facts.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {facts.map((fact, index) => (
                  <SortableFactRow
                    key={fact.id}
                    fact={fact}
                    index={index}
                    onChange={handleFactChange}
                    onRemove={handleFactRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {facts.length === 0 && (
            <p className="text-[13px] text-ash">No facts yet. Add one below.</p>
          )}

          {facts.length < 8 && (
            <button
              type="button"
              onClick={handleAddFact}
              className="mt-3 flex items-center gap-1.5 text-[12px] font-mono text-ash hover:text-bone transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma rounded-[4px] px-1"
            >
              <IconPlus size={12} stroke={1.5} />
              Add fact
            </button>
          )}
        </div>
      </SlideOver>
    </>
  )
}
