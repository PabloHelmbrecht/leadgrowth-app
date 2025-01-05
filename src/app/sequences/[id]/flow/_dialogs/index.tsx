//Dialog Wrapper
import { DialogConstructor } from "./dialog-constructor"

//Dialogs and Schemas
import {
    EmailComposer as EmailComposerBody,
    emailComposerSchema,
} from "./email-composer"
import { TriggerConfiguration as TriggerConfigurationBody } from "./trigger-configuration"
import { triggerNodeDataSchema } from "../_nodes/trigger-node"

export function EmailComposer({ nodeId }: { nodeId: string }) {
    return (
        <DialogConstructor
            nodeId={nodeId}
            schema={emailComposerSchema}
            title="Email Composer"
            description="Compose an email to send to the recipient"
        >
            <EmailComposerBody />
        </DialogConstructor>
    )
}

export function TriggerConfiguration({ nodeId }: { nodeId: string }) {
    return (
        <DialogConstructor
            nodeId={nodeId}
            schema={triggerNodeDataSchema}
            title="Edit Triggers"
            description="Customize your template. Use placeholders for dynamic content."
        >
            <TriggerConfigurationBody />
        </DialogConstructor>
    )
}
