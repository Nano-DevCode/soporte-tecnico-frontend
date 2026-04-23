import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"

interface props {
    backLink: string,
    title: string,
    description: string,
}

export const CustomTitlePageWithBack = ({ backLink, title, description }: props) => {
    return (
        <>
            <div className="flex items-start gap-4">
                <Link to={backLink}>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        aria-label="Volver"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

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
