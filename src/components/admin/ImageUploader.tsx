import { useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Loader2, Star, Trash2, UploadCloud } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { toast } from '../ui/Toast';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'];
const MAX_BYTES = 5 * 1024 * 1024;

export function ImageUploader({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef<number | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const files = Array.from(fileList);

    const invalid = files.find((file) => !ACCEPTED.includes(file.type));
    if (invalid) {
      toast.error('Only PNG, JPG, WEBP, AVIF, or GIF images are allowed');
      return;
    }
    const tooLarge = files.find((file) => file.size > MAX_BYTES);
    if (tooLarge) {
      toast.error(`"${tooLarge.name}" is larger than 5MB`);
      return;
    }

    setUploading(true);
    try {
      const urls = await adminService.uploadImages(files);
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragOver(false);
    void handleFiles(event.dataTransfer.files);
  };

  const removeAt = (index: number) => onChange(value.filter((_, i) => i !== index));

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`focus-ring flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-8 text-center transition ${
          dragOver ? 'border-ink bg-ink/5' : 'border-ink/20 bg-bone hover:border-ink/40'
        }`}
      >
        {uploading ? (
          <Loader2 className="h-7 w-7 animate-spin text-ink/60" />
        ) : (
          <UploadCloud className="h-7 w-7 text-ink/60" />
        )}
        <span className="text-sm font-black text-ink">
          {uploading ? 'Uploading…' : 'Drag & drop images here'}
        </span>
        <span className="text-xs font-bold text-ink/45">or click to browse · PNG, JPG, WEBP up to 5MB</span>
      </button>

      {value.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => (dragIndex.current = index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex.current !== null) reorder(dragIndex.current, index);
                dragIndex.current = null;
              }}
              className="group relative aspect-square cursor-move overflow-hidden rounded-2xl ring-1 ring-ink/10"
            >
              <img src={url} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
              {index === 0 ? (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-1 text-[10px] font-black text-white">
                  <Star className="h-3 w-3 fill-white" /> Cover
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Remove image"
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-danger opacity-0 shadow-sm transition group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="focus-ring flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 text-ink/45 transition hover:border-ink/40"
          >
            <ImagePlus className="h-6 w-6" />
          </button>
        </div>
      ) : null}
      {value.length ? (
        <p className="text-xs font-bold text-ink/45">First image is the cover. Drag to reorder.</p>
      ) : null}
    </div>
  );
}
