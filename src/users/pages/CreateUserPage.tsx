import {
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomUserDataCard } from "../components/CustomUserDataCard"
import { Link } from "react-router"

export const CreateUserPage = () => {

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6">

        <div className="flex items-start gap-4">
            <Link to="/user">
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
                    Registrar Usuario
                </h1>
                <p className="text-sm text-muted-foreground">
                    Complete la información para crear una nueva cuenta
                </p>
            </div>
            </div>

            <div className="space-y-6">
            <CustomUserDataCard />
            </div>

        </div>
    );
}
