'use client';

import { UseFormReturn } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { FileUploadZone } from '../FileUploadZone';
import { RFQFormData } from '../types';

interface Step4Props {
    form: UseFormReturn<RFQFormData>;
    files: File[];
    onFilesChange: (files: File[]) => void;
}

export function Step4Specifications({ form, files, onFilesChange }: Step4Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Specifications & Files</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Add detailed specifications and upload any drawings or documents.
                </p>
            </div>

            <FormField control={form.control} name="specifications"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Detailed Specifications</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="E.g. Material grade, dimensions, standards (IS/ASTM/DIN), surface finish, tolerances..."
                                className="min-h-[130px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField control={form.control} name="notes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Special Requirements / Additional Notes</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Any special packing, delivery, inspection, or compliance requirements..."
                                className="min-h-[100px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div>
                <FileUploadZone
                    files={files}
                    onFilesChange={onFilesChange}
                    label="Upload Drawings / Documents"
                    hint="PDF, DWG, DXF, JPG, PNG, Word, Excel – max 10MB each, up to 10 files"
                />
            </div>
        </div>
    );
}
