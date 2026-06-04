import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useLocation, useNavigate } from "react-router"

interface Props {
    backLink: string,
    title: string,
    description: string,
}

export const CustomTitlePageWithBack = ({ backLink, title, description }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate(backLink);
        }
    };

    return (
        <>
            <div className="flex items-start gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    aria-label="Volver"
                    onClick={handleBack}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
        </>
    )
}
