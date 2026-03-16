'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ALLOWED_TYPES: Record<string, string[]> = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;

interface FileUploadZoneProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    label?: string;
    hint?: string;
}

export function FileUploadZone({
    files,
    onFilesChange,
    maxFiles = MAX_FILES,
    label = 'Upload Files',
    hint = 'PDF, DWG, DXF, Images, Word, Excel (max 10MB each)',
}: FileUploadZoneProps) {
    const onDrop = useCallback(
        (accepted: File[], rejected: any[]) => {
            if (rejected.length > 0) {
                rejected.forEach((r) => {
                    const msg = r.errors[0]?.message || 'File rejected';
                    toast.error(`${r.file.name}: ${msg}`);
                });
            }
            if (files.length + accepted.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} files allowed`);
                return;
            }
            onFilesChange([...files, ...accepted]);
        },
        [files, onFilesChange, maxFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ALLOWED_TYPES,
        maxSize: MAX_FILE_SIZE,
        maxFiles,
    });

    const removeFile = (index: number) => {
        const updated = files.filter((_, i) => i !== index);
        onFilesChange(updated);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
        if (file.type === 'application/pdf') return <FileText className="h-4 w-4 text-red-500" />;
        return <File className="h-4 w-4 text-gray-500" />;
    };

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
                    isDragActive
                        ? 'border-primary bg-primary/5 scale-[1.01]'
                        : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
                )}
            >
                <input {...getInputProps()} />
                <UploadCloud
                    className={cn(
                        'mx-auto h-10 w-10 mb-3 transition-colors',
                        isDragActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                />
                {isDragActive ? (
                    <p className="text-primary font-medium">Drop files here...</p>
                ) : (
                    <>
                        <p className="font-medium mb-1">{label}</p>
                        <p className="text-sm text-muted-foreground">
                            Drag & drop or <span className="text-primary underline">browse</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{hint}</p>
                    </>
                )}
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        {files.length}/{maxFiles} files
                    </p>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border"
                        >
                            {getFileIcon(file)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeFile(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
