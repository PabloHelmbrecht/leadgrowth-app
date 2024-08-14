import { KPI } from "~/components/ui/kpi"

export function KPIColumn(props: {
  value: string | undefined
  label: string
  onHoverValue?: string | undefined
}) {
  return <KPI {...props} />
}
