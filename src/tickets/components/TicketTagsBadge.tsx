import type { Tag } from '@/common/tags/interfaces/tag.interface'
import { Badge } from '@/components/ui/badge'
interface Props {
    tags: Tag[]
}
export const TicketTagsBadge = ({ tags }: Props) => {

    if (!tags || tags.length === 0) return null;
    return (
        <>
            {tags.map((tag) => (
                <Badge key={tag.id} variant={'default'} className='font-semibold px-2.5 py-0.5 tracking-wider bg-muted-foreground text-[10px] sm:text-xs' >
                    {tag.name}
                </Badge >
            ))}
        </>
    )
}
