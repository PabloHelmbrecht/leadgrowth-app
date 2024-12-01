"use client"

//UI
import { Button } from "~/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Checkbox } from "~/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useMultiDialog } from "~/components/ui/multi-dialog"

//NextJS
import { useParams } from "next/navigation"

//React Hook Form & Form Resolver
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Form, FormField, FormMessage } from "~/components/ui/form"

//Atoms and Reducers
import {
  sequencesMockDataAtom,
  uniqueNodeSelectorReducer,
} from "~/lib/stores/mockData"

//Zod & Schemas
import {  z } from "zod"
import { nodeTypesDataSchemas } from "~/app/sequences/[id]/flow/_nodes/node-types"

export const emailComposerSchema = z.discriminatedUnion("isReply", [
  z.object({
    subject: z.string(),
    body: z.string().min(5),
    isReply: z.literal(true),
    includeSignature: z.boolean().default(false).optional(),
  }),
  z.object({
    subject: z.string().min(5),
    body: z.string().min(5),
    isReply: z.literal(false),
    includeSignature: z.boolean().default(false).optional(),
  }),
])

//Utils
import { useSelectorReducerAtom } from "~/lib/utils/reducerAtom"

export function EmailComposer({ nodeId }: { nodeId: string }) {
  const [, setOpen] = useMultiDialog("dialog")
  const { id: sequenceId } = useParams<{ id: string }>()

  const [node, setNode] = useSelectorReducerAtom(
    sequencesMockDataAtom,
    uniqueNodeSelectorReducer(sequenceId, nodeId),
  )

  const dataSchema = nodeTypesDataSchemas[String(node?.type)]

  const nodeData = dataSchema?.safeParse(node?.data)
  let defaultValues: Partial<z.infer<typeof emailComposerSchema>> = {
    subject: "",
    body: "",
    isReply: false,
    includeSignature: false,
  }

  if (nodeData?.success) {
    const { subject, body, isReply, includeSignature } = nodeData.data
    defaultValues = { subject, body, isReply, includeSignature }
  }

  const form = useForm<z.infer<typeof emailComposerSchema>>({
    resolver: zodResolver(emailComposerSchema),
    defaultValues,
  })

  function onSubmit(submitData: z.infer<typeof emailComposerSchema>) {
    setNode((node) => ({
      ...node,
      data: { ...dataSchema?.parse(node.data), ...submitData },
    }))
    setOpen(false)
  }

  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Edit template</DialogTitle>
        <DialogDescription>
          Customize your email template. Use placeholders for dynamic content.
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="compose" className="premium-transition w-full ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="compose">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id={`form-email-composer`}
              className="space-y-8"
            >
              <div className="flex flex-col gap-4 py-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <div>
                      <div className=" flex w-full flex-row items-center rounded-md bg-neutral-100">
                        <Label
                          htmlFor="subject"
                          className="flex h-full w-fit items-center justify-start rounded-l-md border border-neutral-200 p-3 text-right"
                        >
                          Subject
                        </Label>
                        <Input
                          className=" rounded-l-none"
                          {...field}
                          disabled={form.watch("isReply")}
                        />
                      </div>
                      <FormMessage className="pt-2" />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="body">Body</Label>
                      <Textarea className="min-h-[300px]" {...field} />
                      <FormMessage />
                    </div>
                  )}
                />

                <div className=" flex flex-row items-center justify-start gap-6">
                  <FormField
                    control={form.control}
                    name="isReply"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isReply"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="isReply">
                          Reply to previous thread
                        </Label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="includeSignature"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeSignature"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="includeSignature">
                          Include Signature
                        </Label>
                      </div>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="preview" className="py-4">
          <div className="rounded-md border p-4">
            <h3 className="font-bold">Subject: {form.watch("subject")}</h3>
            <pre className="mt-2 max-h-[800px] min-h-80 whitespace-pre-wrap">
              {form.watch("body")}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" form={`form-email-composer`}>
          Send
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
