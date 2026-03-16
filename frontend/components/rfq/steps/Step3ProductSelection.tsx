'use client';

import { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useRFQStore } from '@/lib/store/rfqStore';
import { useRouter } from 'next/navigation';

const UNITS = ['Pcs', 'Kg', 'm²', 'm³', 'm', 'Nos', 'Rolls', 'Bags', 'Tons', 'Liters'];

export function Step3ProductSelection() {
    const router = useRouter();
    const { items, addItem, removeItem, updateItem } = useRFQStore();

    const [newItem, setNewItem] = useState({
        productName: '',
        quantity: 1,
        unit: 'Pcs',
        notes: '',
    });

    const handleAddItem = () => {
        if (!newItem.productName.trim()) return;
        addItem({
            id: `manual-${Date.now()}`,
            productName: newItem.productName,
            category: 'OTHER_ACCESSORIES',
            quantity: newItem.quantity,
            unit: newItem.unit,
            notes: newItem.notes,
        });
        setNewItem({ productName: '', quantity: 1, unit: 'Pcs', notes: '' });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Product Selection</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Add the products or materials you need a quote for.
                </p>
            </div>

            {/* Items list */}
            {items.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Added Items ({items.length})
                    </h3>
                    {items.map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                                {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="sm:col-span-1">
                                    <p className="font-medium truncate">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground">{item.category}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        min={1}
                                        className="h-8 w-20 text-sm"
                                        onChange={(e) =>
                                            updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">{item.unit}</span>
                                </div>
                                {item.notes && (
                                    <p className="text-xs text-muted-foreground truncate">{item.notes}</p>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive shrink-0"
                                onClick={() => removeItem(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add item form */}
            <div className="border rounded-lg p-4 bg-muted/10 space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Item
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1 space-y-1">
                        <Label className="text-xs">Product / Material Name</Label>
                        <Input
                            placeholder="e.g. Steel Pipes"
                            value={newItem.productName}
                            onChange={(e) => setNewItem(p => ({ ...p, productName: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                            type="number"
                            min={1}
                            value={newItem.quantity}
                            onChange={(e) => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Unit</Label>
                        <Select
                            value={newItem.unit}
                            onValueChange={(v) => setNewItem(p => ({ ...p, unit: v }))}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Notes (optional)</Label>
                    <Input
                        placeholder="Size, grade, colour, or other specifications..."
                        value={newItem.notes}
                        onChange={(e) => setNewItem(p => ({ ...p, notes: e.target.value }))}
                    />
                </div>
                <Button type="button" variant="outline" onClick={handleAddItem} disabled={!newItem.productName.trim()}>
                    <Plus className="h-4 w-4 mr-2" /> Add to List
                </Button>
            </div>

            {/* Browse products shortcut */}
            <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg text-sm text-muted-foreground">
                <Package className="h-5 w-5 shrink-0" />
                <span>
                    Or{' '}
                    <button
                        type="button"
                        className="text-primary underline"
                        onClick={() => router.push('/products')}
                    >
                        browse our product catalog
                    </button>{' '}
                    to add items directly.
                </span>
            </div>

            {items.length === 0 && (
                <p className="text-sm text-destructive/70 text-center py-2">
                    Please add at least one item to continue.
                </p>
            )}
        </div>
    );
}
