import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
    return (
        <Card className="flex flex-col md:flex-row items-start overflow-hidden">
            <Skeleton className="w-full md:w-32 h-32 md:min-h-[100px] shrink-0" />
            <CardContent className="p-4 flex-grow w-full space-y-3">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                </div>
            </CardContent>
        </Card>
    );
}