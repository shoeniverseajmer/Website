import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderTree, Plus, Search, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminTable } from '../../components/admin/AdminTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from '../../components/ui/Toast';
import { adminService } from '../../services/adminService';
import { slugify } from '../../utils/format';
import { getApiErrorMessage } from '../../utils/apiError';
import type { Category } from '../../types';

export function AdminCategoriesPage() {
  const { data: fetchedCategories } = useQuery({ queryKey: ['admin-categories'], queryFn: adminService.categories });
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [search, setSearch] = useState('');

  // Guard on `data` (not a `= []` default) so an undefined→new-array-each-render
  // cycle can't trigger an infinite setState loop.
  useEffect(() => {
    if (fetchedCategories) setCategories(fetchedCategories);
  }, [fetchedCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase();
    return categories.filter((category) => !query || category.name.toLowerCase().includes(query) || category.slug.toLowerCase().includes(query));
  }, [categories, search]);

  const addCategory = async () => {
    const nextName = name.trim();
    const nextSlug = (slug || slugify(nextName)).trim();
    if (!nextName || !nextSlug) {
      toast.error('Enter category name');
      return;
    }
    if (categories.some((category) => category.slug === nextSlug)) {
      toast.error('Category slug already exists');
      return;
    }
    try {
      const created = await adminService.createCategory({ name: nextName, slug: nextSlug });
      setCategories((current) => [created, ...current]);
      setName('');
      setSlug('');
      toast.success('Category added');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not add the category. Please try again.'));
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await adminService.deleteCategory(id);
      setCategories((current) => current.filter((category) => category.id !== id));
      toast.success('Category removed');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not remove the category. Please try again.'));
    }
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Merchandising"
        title="Categories"
        copy="Organize catalogue destinations for storefront filtering, navigation, and editorial campaigns."
      />

      <div className="mb-5 grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5 lg:grid-cols-[1fr_1fr_auto]">
        <Input
          label="Name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (!slug) setSlug(slugify(event.target.value));
          }}
          placeholder="Sneakers"
        />
        <Input label="Slug" value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="sneakers" />
        <Button variant="secondary" className="self-end text-black" icon={<Plus className="h-4 w-4" />} onClick={addCategory}>
          Add category
        </Button>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} leftIcon={<Search className="h-4 w-4" />} placeholder="Search categories" />
        <div className="rounded-3xl bg-ink p-4 text-white">
          <div className="flex items-center gap-3">
            <FolderTree className="h-5 w-5 text-gold" />
            <div>
              <p className="text-2xl font-black">{categories.length}</p>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Categories</p>
            </div>
          </div>
        </div>
      </div>

      <AdminTable headers={['Name', 'Slug', 'Usage', 'Actions']} minWidth={760}>
        {filteredCategories.map((category) => (
          <tr key={category.id}>
            <td className="px-4 py-4 font-black">{category.name}</td>
            <td className="px-4 py-3">{category.slug}</td>
            <td className="px-4 py-3 text-sm text-ink/55">Storefront filter</td>
            <td className="px-4 py-3">
              <Button variant="danger" size="icon" onClick={() => removeCategory(category.id)} title="Remove category">
                <Trash2 className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
