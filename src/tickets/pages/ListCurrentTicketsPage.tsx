import { Plus, Tickets } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";
import { Can } from "@/common/permission/Can";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { CustomCurrentTicketList } from "../components/CustomCurrentTicketList";

export function ListCurrentTicketPage() {

	const { t } = useTranslation();

	return (
		<>
			<CustomTitleCard icon={Tickets}
				title={t("tickets.list_current_page.title")}
				description={t("tickets.list_current_page.description")} />
			<div className="space-y-3 md:space-y-6">


				<div className="ml-auto flex flex-wrap gap-2 justify-end">
					<Can permission={"CREATE_TICKET"} >
						<Link to="/tickets/new">
							<Button>
								<Plus className="h-4 w-4" />
								{t("tickets.list_page.actions.new")}

							</Button>
						</Link>
					</Can >

					<Can permission={"CREATE_TICKET_ON_BEHALF"} >
						<Link to="/tickets/on-behalf">
							<Button>
								<Plus className="h-4 w-4" />
								{t("tickets.actions.on_behalf.label")}

							</Button>
						</Link>
					</Can >
				</div>

				<CustomCurrentTicketList />
			</div >
		</>
	);
}