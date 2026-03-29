---
title: Understanding the ADK
tags: posts
---

### Guiding question

How are AI agents actually represented as code?

### Meanderings

Code is boundless. Every new project starts with a million questions. To get my bearings, it's often easier to do some exploration and temporarily adopt the opinions present in whatever stack I'm learning to see the intention. Running the paved path is too boring though, while running the hard packed mini trail right next to it is just enough excitement. In this spirit, I spent a few hours trying to understand Google's ADK via one of its published Codelabs, but in TypeScript not Python. For reference, ADK -> Agent Developer Kit, an opinionated code first framework that establishes an abstraction over ai agent creation.

### Agents

For background on agents, I think the [Google AI Agent intensive](https://www.kaggle.com/learn-guide/5-day-agents) is a good place to understand the Google take on Agents (however optimistic their view may be).

To orient to my own mental models:
Agents = Tools + Models + Context Management

**Aside:** You might see _Memory_ used instead of Context Management, but I think the analogy doesn't really work. It'd be more akin to memory if model weights actually changed in someway, whereas Context Management makes it more clear it's still just all about the LLM inputs. For my sake, it's easier to think of context management as helpful note taking.

For me to derive any value from the ADK, I needed to understand how it's opinions help any/all of these three components. The walkthroughs are also only useful if they help show how the framework deals with each.

### ADK, but in Typescript

The Codelab uses Colab notebooks in Python to demonstrate ADK features. Glancing at the ADK website, it is clear Python is the most supported language, as a ADK v2.0 has Python support. Meanwhile, Google announced TypeScript support [last December](https://developers.googleblog.com/introducing-agent-development-kit-for-typescript-build-ai-agents-with-the-power-of-a-code-first-approach/) and I used npm package version 0.3.0. Translating from Python to TypeScript was pretty straightforward and really emphasized the abstractions the ADK gives. The main abstractions I found were: deterministic agents, non-deterministic agents, composition is favored, session support, memory support, and evals are easy to generate. I had a few pain points along the way, mainly that the ADK docs aren't great for TypeScript as they had Go language snippets under TypeScript sections (though continually getting better). Also, having the term 'Agent' for both deterministic and non-deterministic behavior is a choice I wouldn't have made, as it's pretty clear the deterministic agents are just different orchestration patterns and non deterministic agents are LLM calls. I don't see a big overlap there to label both 'Agents'. Renaming the deterministic agents as 'workflow' or 'orchestrator' or something similar and leaving the 'agent' label to the LLM parts would enable better interperability to the ideas each provides.

Expanding on the TypeScript experience, I found it interesting that Zod is integral to ADK. Whereas the Python snippets show docstrings and presumably type hints as schema for input, in Typescript a config object is used.

```ts
const getCurrentTime = new FunctionTool({
  name: "get_current_time",
  description: "returns the current time in a specified city.",
  parameters: z.object({
    city: z
      .string()
      .describe("The name of the city for which to retireve the current time."),
  }),
  execute: ({ city }) => {
    return {
      status: "success",
      report: `The current time in ${city} is 10:47 am`,
    };
  },
});
```

Looking at this code snippet, it's a bit unfortunate that I have to manually specify the parameter validation to the function instead using a TypeScript type for `city`. I understand that this situation occurs because TypeScript is transpiled to JavaScript and types are fully erased. It's a language problem, but this being a framework, some syntactic sugar to make this more ergonomic seems warranted. Prompting Claude for alternatives here, the first few options already look more promising than this approach: [`ts-to-zod`](https://github.com/fabien0102/ts-to-zod) performing a build time codegen to auto generate the zod validation code or [`typia`](https://typia.io/docs/) to emit validator code using typescript types. Maybe that'll be a future direction the ADK goes.

Another code snippet I'd like to highlight is the manual orchestration vs ADK orchestration. For manual orchestration, chaining agent calls (sans error handling) look something like:

```ts
// Manually orchestrating agent responses
...
      const foodieSession = await sessionService.createSession({
        appName: routerAgent.name,
        userId: "foodie007",
      });
      const foodieResponse = await runAgentQuery(
        foodieAgent, // important
        q,
        foodieSession,
        "foodie007",
        routerAgent.name,
        sessionService,
      );

      const match = foodieResponse.match(/\*\*(.*?)\*\*/);
      if (!match) {
        console.log(
          "could not determine the restaurant name from the response.",
        );
        continue;
      }
      const destination = match?.[0];

      const directionsQuery = `Give me directions to ${destination} from the Palo Alto Caltrain station.`;
      const transportSession = await sessionService.createSession({
        appName: transportationAgent.name,
        userId: "transportation007",
      });
      const transportationRes = await runAgentQuery(
        transportationAgent, // important
        directionsQuery,
        transportSession,
        "transportation007",
        transportationAgent.name,
        sessionService,
      );
...
```

Using the ADK the same code is expressed as:

```ts
// Using ADK Construct
export const findAndNavigateCombo = new SequentialAgent({
  name: "find_and_navigate_agent",
  subAgents: [foodieAgent, transporationAgent],
  description:
    "A workflow that first finds a location and then provides directions to it.",
});
```

Clarity wins, and the ADK construct is clearer than the manual orchestration. I like that the ADK embraces composition as a design pattern. The one nit pick I have about this basic ADK construct is that the `subAgents` are run in list specified order. It's common enough that I can assume order matters in a list, but for self documenting code, having an Ordered List type or using a pipeline pattern for `subAgents` would be clearer imho.

Finally, I thought the Codelab itself was pretty interesting. In addition to it being a crash course into the ADK, it reveals a lot of still current Prompt design techniques. All the agent instructions followed a similar format: role + goals + any guidelines + few shot examples + what to return. In string form its like `'You are a ${AGENT_ROLE}, your goal is ${AGENT_GOALS}, your guidelines are ${AGENT_GUIDING_PRINCIPLES}, Output instructions are ${OUTPUT_GUIDELINES}'` and any really important instructions in all-caps/bold. This mostly lines up with the prompting guides I have reviewed. The Output instructions are especially telling however, that the ADK needs some sort of structured output built in. I've used frameworks like BAML that really help, and some easy integration or another opionated way to do this common task would really elevate the ADK's utility. The other obvious target is, evaluating models + prompts in a systematic way to optimize the agents. The Codelab doesn't really go into this, it just gives golden prompts. I think the point is that with code, it's easier to A/B test all of those since you can code the experiments yourself without a framework. It's a list of prompt variations and a list of models to test with, and the built in evals could be used to make a score. Unfortunately, the Codelab didn't touch on evals nor setting up ADK with non Gemini models, but both use cases have first class support.

### Takeaways

In the point in time I used the ADK, it's not Typescript ready. I didn't need to go use it to get to that conclusion. SemVer (hopefully) still has meaning and the ADK doesn't have a major version out for Typescript.

On a positive note, the tooling is usable now for ADK with TypeScript for experiments. The web UI makes generating eval datasets very doable. I think it's an actively developed project, as evidenced by 3 minor update bumps improving the ADK usability in the short time I've spent looking at it. No clear vendor lock is the second biggest positive, as multiple model providers are supported.

Finally, if anyone with the ADK dev team's attention wants a wishlist:

1. Add code with AI support for non Python languages, not just a local MCP server serving an LLMs.txt
2. Shoutout Opencode with a blurb on configuring Opencode with the dev MCP server provided
3. For every major and minor version that changes the API, a few shot example on how to upgrade a codebase would be fantastic. Let the AIs do the drudgery of updates.
4. Add evals as a core requirement of a Colab for Beginner to Expert. That's the biggest value add to using the framework over just having an AI handle the glue code you abstract over.

### Original Sources + Repo link

Original Source: [Codelab ADK Crash Course - From Beginner to Expert](https://codelabs.developers.google.com/onramp/instructions?hl=en#0)

My Repo: [ADK Adventure](https://github.com/bhallaY/adk-adventure)

- the files are labeled in accordance with the Codelab sections, and each is runnable with either `npx ts-node` or `npx adk run` commands.
