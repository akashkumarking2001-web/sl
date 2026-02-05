import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNext: boolean;
    hasPrev: boolean;
    getPageNumbers: () => (number | string)[];
    startIndex?: number;
    endIndex?: number;
    totalItems?: number;
    className?: string;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    hasNext,
    hasPrev,
    getPageNumbers,
    startIndex,
    endIndex,
    totalItems,
    className,
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers();

    return (
        <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
            {/* Results info */}
            {startIndex !== undefined && endIndex !== undefined && totalItems !== undefined && (
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{startIndex}</span> to{' '}
                    <span className="font-medium text-foreground">{endIndex}</span> of{' '}
                    <span className="font-medium text-foreground">{totalItems}</span> results
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* First page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrev}
                    aria-label="Go to first page"
                    className="h-9 w-9"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrev}
                    aria-label="Go to previous page"
                    className="h-9 w-9"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-muted-foreground"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNum = page as number;
                        const isActive = pageNum === currentPage;

                        return (
                            <Button
                                key={pageNum}
                                variant={isActive ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => onPageChange(pageNum)}
                                aria-label={`Go to page ${pageNum}`}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'h-9 w-9',
                                    isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                                )}
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>

                {/* Next page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNext}
                    aria-label="Go to next page"
                    className="h-9 w-9"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNext}
                    aria-label="Go to last page"
                    className="h-9 w-9"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
