'use client';

import { Document } from '@/lib/api/documents';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DocumentCardProps {
    document: Document;
    onDownloadClick: (document: Document) => void;
}

export function DocumentCard({ document, onDownloadClick }: DocumentCardProps) {
    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('doc')) return '📝';
        if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
        if (fileType.includes('image')) return '🖼️';
        return '📁';
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">{getFileIcon(document.fileType)}</div>
                        <div>
                            <CardTitle className="text-lg">{document.title}</CardTitle>
                            <CardDescription className="mt-1">
                                {document.category}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="secondary">{document.fileType.split('/')[1]?.toUpperCase()}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {document.description || 'No description available'}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{document.viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{document.downloadCount} downloads</span>
                    </div>
                    <span>{formatFileSize(document.fileSize)}</span>
                </div>
                {document.tags && document.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {document.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={() => onDownloadClick(document)}
                    className="w-full"
                    variant="default"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </CardFooter>
        </Card>
    );
}
