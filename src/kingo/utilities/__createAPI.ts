import { API } from '../Interfaces/API';
import { Event } from '../Interfaces/Event';
import { Config } from '../Interfaces/Config';
import { existsSync, readdirSync, readFileSync } from 'fs';

const __createAPI = (bundleConfig: Config, api: API, apiPath: string): void => {
    // Check if API folder exists
    if (existsSync(apiPath)) {
        const prPath = `${apiPath}/${bundleConfig.prefixes.pr}.js`;
        const docsPath = `${apiPath}/${bundleConfig.prefixes.docs}.md`;
        const testsPath = `${apiPath}/${bundleConfig.prefixes.tests}.js`;

        // In case the API has some documentation, add it to it.
        if (existsSync(docsPath)) {
            const markdown = readFileSync(docsPath, 'utf-8');
            api.description = markdown;
        }

        // Pre-resquest scripts should come before
        // test scripts.
        if (existsSync(prPath)) {
            const script = readFileSync(prPath, 'utf-8');

            const event: Event = {
                listen: "prerequest",
                script: {
                    type: "text/javascript",
                    exec: script.split('\r\n')
                }
            };

            api.event.push(event);
        }

        // Test scripts come after the pre-request, actually,
        // the order doesn't matter to Postman, but just to
        // have some human logical approach.
        if (existsSync(testsPath)) {
            const tests = readFileSync(testsPath, 'utf-8');

            const event: Event = {
                listen: "test",
                script: {
                    type: "text/javascript",
                    exec: tests.split('\r\n')
                }
            };

            api.event.push(event);
        }
    }
}

export { __createAPI };