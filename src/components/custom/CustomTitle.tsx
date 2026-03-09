import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface Props {
  title: string;
  description: string;
}

export const CustomTitle = ({ title, description }: Props) => {
  return (
    <div>
      <CardHeader className="p-0">
        <CardTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          {title}
        </CardTitle>
        <CardDescription className="mt-1 text-sm sm:text-base">
          {description}
        </CardDescription>
      </CardHeader>
    </div>
  )
}