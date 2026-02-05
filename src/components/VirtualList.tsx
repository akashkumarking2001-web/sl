import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    estimateSize?: number;
    overscan?: number;
    className?: string;
    height?: string | number;
}

export function VirtualList<T>({
    items,
    renderItem,
    estimateSize = 80,
    overscan = 5,
    className,
    height = '600px',
}: VirtualListProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateSize,
        overscan,
    });

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div
            ref={parentRef}
            className={cn('overflow-auto', className)}
            style={{
                height: typeof height === 'number' ? `${height}px` : height,
                contain: 'strict',
            }}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualItems.map((virtualRow) => (
                    <div
                        key={virtualRow.index}
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        {renderItem(items[virtualRow.index], virtualRow.index)}
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {items.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No items to display</p>
                </div>
            )}
        </div>
    );
}

export default VirtualList;
