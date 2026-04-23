interface Props {
    label: string;
}


export const CustomSectionInfo = ({ label }: Props) => {
    return (
        <div className="flex items-center h-6 gap-2">
            <div className='bg-foreground h-full w-0.5' />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                {label}
            </h3>
        </div>
    )
}
