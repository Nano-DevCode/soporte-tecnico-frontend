import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";

interface Props {
    title: string;
    description: string;
    backLink: string;
    children: React.ReactNode;
}

export const CustomFormPageLayout = ({ title, description, backLink, children }: Props) => (
    <div className={`mx-auto space-y-5`}>
        <CustomTitlePageWithBack
            backLink={backLink}
            title={title}
            description={description}
        />
        {children}
    </div>
);