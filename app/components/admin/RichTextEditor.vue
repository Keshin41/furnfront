<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { GoogleMap } from '~/utils/tiptap-google-map';
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  RemoveFormatting,
  MapPinned,
} from 'lucide-vue-next';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  minHeight?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const normalizeGoogleMapEmbedUrl = (input: string) => {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return null;
  }

  const iframeMatch = trimmedInput.match(/src=["']([^"']+)["']/i);
  if (iframeMatch?.[1]) {
    return iframeMatch[1];
  }

  try {
    const parsedUrl = new URL(trimmedInput);

    if (parsedUrl.pathname.includes('/maps/embed')) {
      return parsedUrl.toString();
    }

    const query = parsedUrl.searchParams.get('q');
    if (query) {
      return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(trimmedInput)}&output=embed`;
  } catch {
    return `https://www.google.com/maps?q=${encodeURIComponent(trimmedInput)}&output=embed`;
  }
};

const insertGoogleMap = () => {
  if (!import.meta.client || !editor.value) {
    return;
  }

  const input = window.prompt(
    'Colle un lien Google Maps, une iframe embed, ou une adresse :',
  );

  if (!input?.trim()) {
    return;
  }

  const embedUrl = normalizeGoogleMapEmbedUrl(input);
  if (!embedUrl) {
    return;
  }

  editor.value.chain().focus().setGoogleMap({ src: embedUrl }).run();
};

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit, Underline, GoogleMap],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none p-3',
    },
  },
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML());
  },
});

watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
      editor.value.commands.setContent(val ?? '');
    }
  },
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-brand-light-blue/70 bg-brand-white shadow-xs focus-within:border-brand-sky focus-within:ring-1 focus-within:ring-brand-sky/30">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-0.5 border-b border-brand-light-blue/60 bg-brand-light-blue/15 px-2 py-1.5">
      <!-- History -->
      <button
        type="button"
        :disabled="!editor?.can().undo()"
        class="toolbar-btn"
        title="Annuler"
        @click="editor?.chain().focus().undo().run()"
      >
        <Undo2 class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        :disabled="!editor?.can().redo()"
        class="toolbar-btn"
        title="Rétablir"
        @click="editor?.chain().focus().redo().run()"
      >
        <Redo2 class="h-3.5 w-3.5" />
      </button>

      <div class="mx-1 h-4 w-px bg-brand-light-blue/70" />

      <!-- Headings -->
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('heading', { level: 1 }) }]"
        title="Titre 1"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <Heading1 class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('heading', { level: 2 }) }]"
        title="Titre 2"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <Heading2 class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('heading', { level: 3 }) }]"
        title="Titre 3"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <Heading3 class="h-3.5 w-3.5" />
      </button>

      <div class="mx-1 h-4 w-px bg-brand-light-blue/70" />

      <!-- Inline styles -->
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('bold') }]"
        title="Gras"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <Bold class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('italic') }]"
        title="Italique"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <Italic class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('underline') }]"
        title="Souligné"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <UnderlineIcon class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('strike') }]"
        title="Barré"
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        <Strikethrough class="h-3.5 w-3.5" />
      </button>

      <div class="mx-1 h-4 w-px bg-brand-light-blue/70" />

      <!-- Lists -->
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('bulletList') }]"
        title="Liste à puces"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <List class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        :class="['toolbar-btn', { active: editor?.isActive('orderedList') }]"
        title="Liste numérotée"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <ListOrdered class="h-3.5 w-3.5" />
      </button>

      <div class="mx-1 h-4 w-px bg-brand-light-blue/70" />

      <!-- Clear formatting -->
      <button
        type="button"
        class="toolbar-btn"
        title="Supprimer la mise en forme"
        @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()"
      >
        <RemoveFormatting class="h-3.5 w-3.5" />
      </button>

      <div class="mx-1 h-4 w-px bg-brand-light-blue/70" />

      <!-- Google Maps -->
      <button
        type="button"
        class="toolbar-btn"
        title="Insérer une carte Google Maps"
        @click="insertGoogleMap"
      >
        <MapPinned class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- Editor area -->
    <EditorContent
      :editor="editor"
      :style="{ minHeight: minHeight ?? '120px' }"
      class="cursor-text text-sm text-brand-ink"
    />
  </div>
</template>

<style>
@reference "~/assets/css/main.css";

/* Toolbar button base + active state */
.toolbar-btn {
  @apply flex h-7 w-7 items-center justify-center rounded-lg text-brand-ink transition-colors hover:bg-brand-sky/15 hover:text-brand-dark-blue disabled:cursor-not-allowed disabled:opacity-30;
}
.toolbar-btn.active {
  @apply bg-brand-sky/20 text-brand-dark-blue;
}

/* Prose styles for the editor content */
.ProseMirror {
  @apply min-h-[inherit];
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  @apply pointer-events-none float-left h-0 text-brand-ink/40;
}
.ProseMirror h1 { @apply text-xl font-bold text-brand-dark-blue; }
.ProseMirror h2 { @apply text-lg font-bold text-brand-dark-blue; }
.ProseMirror h3 { @apply text-base font-semibold text-brand-dark-blue; }
.ProseMirror ul { @apply list-disc pl-5; }
.ProseMirror ol { @apply list-decimal pl-5; }
.ProseMirror li { @apply my-0.5; }
.ProseMirror strong { @apply font-bold; }
.ProseMirror em { @apply italic; }
.ProseMirror u { @apply underline; }
.ProseMirror s { @apply line-through; }
.ProseMirror > * + * { @apply mt-1.5; }
</style>
