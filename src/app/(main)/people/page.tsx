"use client"
//React
import { useMemo } from "react"

//UI
import { TriggerAndBreadcrumb } from "~/components/layout/nav-sidebar/trigger-breadcrumb"
import { Separator } from "~/components/ui/separator"

//Filters & Actions
import { TableFilter } from "~/components/layout/table/table-filter"
import { ClearFilterActionButton } from "~/components/layout/table/actions/clean-filters"
import { SelectAllCheckbox } from "~/components/layout/table/actions/select-all"

//Data Table
import { DataTable } from "~/components/layout/table/data-table"
import { useColumns } from "./columns"
import {
    type TableContext,
    tableContext,
} from "~/components/layout/table/table-context"

//Icons
import {} from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import {
    IsAllRowsSelectedAtom,
    columnFiltersAtom,
    rowSelectionAtom,
    resetAllFiltersAtom,
    tableAtom,
} from "~/lib/stores/people-table"

//Hooks
import { useContacts, type Contact } from "~/lib/hooks/use-contacts"
import { useContactStages } from "~/lib/hooks/use-contacts-stages"
import { useCompanies } from "~/lib/hooks/use-companies"

export default function HomePage() {
    const { data, isLoading, isError } = useContacts({})

    const columns = useColumns()

    const { data: companies } = useCompanies({})
    const { data: stagesOptions } = useContactStages({})

    const companiesOptions = useMemo(
        () =>
            companies?.map((company) => ({
                label: company.name ?? "",
                value: company.id,
            })) ?? [],
        [companies],
    )

    return (
        <tableContext.Provider
            value={
                {
                    data,
                    isLoading,
                    isError,
                    IsAllRowsSelectedAtom,
                    columnFiltersAtom,
                    rowSelectionAtom,
                    resetAllFiltersAtom,
                    tableAtom,
                } as TableContext<unknown>
            }
        >
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <TriggerAndBreadcrumb block="Explore" link="/" page="People" />
                <div className="flex items-center justify-end gap-3">
                    {/* Acá van los botones 
                   - Agregar nuevo contact
                   - Importar contactos
                   - Configurar contactos
                   */}
                </div>
            </header>
            <Separator orientation="horizontal" className=" hw-full" />
            <main className="flex h-full w-full flex-col gap-6 p-6">
                <div className="flex flex-initial items-center gap-6 pl-3 ">
                    <SelectAllCheckbox />

                    <TableFilter
                        options={companiesOptions}
                        filterName="company"
                        columnName="Companies"
                    />
                    <TableFilter
                        options={stagesOptions ?? []}
                        filterName="stage"
                        columnName="Stages"
                    />
                    <ClearFilterActionButton />
                    {/* Acá van  los action buttons
                    - Agregar a secuencia
                    - Agregar a audiencia (a futuro)
                    - Eliminar contacto
                    - Exportar contacto
                    - Editar contacto (a futuro)
                    - Finalizar secuencia
                    - Asignar dueño
                    - Asignar empresa
                    - Asignar stage
                    */}
                </div>

                <DataTable<Contact, unknown> columns={columns} />
            </main>
        </tableContext.Provider>
    )
}
