import { type LucideIcon } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";

interface CustomEmptyListStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
}

export const CustomEmptyListState = ({
    icon: Icon,
    title,
    description,

}: CustomEmptyListStateProps) => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Icon />
                </EmptyMedia>
                <EmptyTitle>
                    {title}
                </EmptyTitle>
                <EmptyDescription>
                    {description}
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
};