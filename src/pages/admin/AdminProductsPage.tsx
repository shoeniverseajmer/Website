import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Plus, Search, Star, Tag, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminTable } from '../../components/admin/AdminTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { StockStepper } from '../../components/admin/StockStepper';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { toast } from '../../components/ui/Toast';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/format';
import type { Product } from '../../types';

type ProductView = 'all' | 'active' | 'sale' | 'bestseller' | 'low-stock';

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { data: fetchedProducts = [] } = useQuery({ queryKey: ['admin-products'], queryFn: adminService.products });
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ProductView>('all');

  const refreshCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['product'] });
  };

  useEffect(() => {
    setProducts(fetchedProducts);
  }, [fetchedProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = search.toLowerCase();
      const matchesSearch = query
        ? [product.name, product.gender_category, product.product_type, product.occasion, product.accessory_type]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))
        : true;
      const matchesView =
        view === 'all' ||
        (view === 'active' && product.is_active) ||
        (view === 'sale' && product.is_on_sale) ||
        (view === 'bestseller' && product.is_bestseller) ||
        (view === 'low-stock' && product.stock <= 10);
      return matchesSearch && matchesView;
    });
  }, [products, search, view]);

  const updateProduct = async (product: Product, patch: Partial<Product>, message: string) => {
    const next = { ...product, ...patch };
    setProducts((current) => current.map((item) => (item.id === product.id ? next : item)));
    await adminService.upsertProduct(next);
    refreshCaches();
    toast.success(message);
  };

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setProducts((current) => current.filter((item) => item.id !== product.id));
    try {
      await adminService.deleteProduct(product.id);
      refreshCaches();
      toast.success('Product deleted');
    } catch {
      setProducts(fetchedProducts);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue control"
        title="Products"
        copy="Manage product visibility, stock, sale placement, bestseller flags, and catalogue health."
        action={
          <Button variant="secondary" className="text-black" icon={<Plus className="h-4 w-4" />}>
            <Link to="/admin/products/new" className="text-black">Add product</Link>
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5 lg:grid-cols-[1fr_220px]">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          placeholder="Search products, category, occasion"
          aria-label="Search products"
        />
        <Select value={view} onChange={(event) => setView(event.target.value as ProductView)} aria-label="Filter products">
          <option value="all">All products</option>
          <option value="active">Active</option>
          <option value="sale">On sale</option>
          <option value="bestseller">Bestsellers</option>
          <option value="low-stock">Low stock</option>
        </Select>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        {[
          ['Total', products.length],
          ['Active', products.filter((product) => product.is_active).length],
          ['Sale', products.filter((product) => product.is_on_sale).length],
          ['Low stock', products.filter((product) => product.stock <= 10).length]
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/40">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <AdminTable headers={['Product', 'Type', 'Stock', 'Price', 'Flags', 'Status', 'Actions']} minWidth={1040}>
        {filteredProducts.map((product) => (
          <tr key={product.id} className="align-middle">
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                <img src={product.product_images?.[0]?.image_url} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
                <div>
                  <p className="font-black">{product.name}</p>
                  <p className="text-xs font-bold text-ink/45">{product.slug}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 capitalize">
              <p className="font-bold">{product.gender_category} / {product.product_type}</p>
              <p className="text-xs text-ink/50">{product.occasion}</p>
            </td>
            <td className="px-4 py-3">
              <StockStepper value={product.stock} onChange={(stock) => updateProduct(product, { stock }, 'Stock updated')} />
            </td>
            <td className="px-4 py-3">
              <p className="font-black">{formatCurrency(product.sale_price ?? product.price)}</p>
              {product.sale_price ? <p className="text-xs text-ink/45 line-through">{formatCurrency(product.price)}</p> : null}
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateProduct(product, { is_bestseller: !product.is_bestseller }, product.is_bestseller ? 'Removed bestseller flag' : 'Marked bestseller')}
                  className={`focus-ring inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-black ${product.is_bestseller ? 'bg-gold text-ink' : 'bg-bone text-ink/55'}`}
                >
                  <Star className={`h-3.5 w-3.5 ${product.is_bestseller ? 'fill-ink' : ''}`} />
                  Bestseller
                </button>
                <button
                  onClick={() => updateProduct(product, { is_on_sale: !product.is_on_sale }, product.is_on_sale ? 'Removed sale flag' : 'Marked sale product')}
                  className={`focus-ring inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-black ${product.is_on_sale ? 'bg-clay text-white' : 'bg-bone text-ink/55'}`}
                >
                  <Tag className="h-3.5 w-3.5" />
                  Sale
                </button>
              </div>
            </td>
            <td className="px-4 py-3">
              <button onClick={() => updateProduct(product, { is_active: !product.is_active }, product.is_active ? 'Product hidden' : 'Product active')}>
                <StatusBadge value={product.is_active ? 'Active' : 'Hidden'} tone={product.is_active ? 'success' : 'neutral'} />
              </button>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" title="View product">
                  <Link to={`/product/${product.slug}`}><Eye className="h-4 w-4" /></Link>
                </Button>
                <Button variant="secondary" size="icon" title="Edit product">
                  <Link to={`/admin/products/edit/${product.id}`}><Pencil className="h-4 w-4" /></Link>
                </Button>
                <Button variant="danger" size="icon" title="Delete product" onClick={() => deleteProduct(product)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
