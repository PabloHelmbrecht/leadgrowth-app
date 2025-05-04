import { Client, Connection } from "@temporalio/client"

//Env Variables
import { env } from "~/env"

const client: Client = makeClient()

const { NODE_ENV = "development" } = env
const isDeployed = ["production", "staging", "test"].includes(NODE_ENV)

function makeClient(): Client {
    // const cert = await fs.readFile('./path-to/your.pem');
    // const key = await fs.readFile('./path-to/your.key');

    let connectionOptions = {}
    if (isDeployed) {
        connectionOptions = {
            // address: 'your-namespace.tmprl.cloud:7233',
            // tls: {
            //   clientCertPair: {
            //     crt,
            //     key,
            //   },
            // },
        }
    }

    const connection = Connection.lazy(connectionOptions)
    return new Client({ connection })
}

export function getTemporalClient(): Client {
    return client
}
