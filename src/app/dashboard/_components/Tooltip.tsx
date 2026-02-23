import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip"

export function ToolTip({children , content}: {children: React.ReactNode , content: string}) {
  return (
    <TooltipProvider>
        <Tooltip>
        <TooltipTrigger asChild>
            {children}
        </TooltipTrigger>
        <TooltipContent className="rounded-none ">
            <p>{content}</p>
        </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
