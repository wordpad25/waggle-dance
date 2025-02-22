<h1 align="center">Waggle🐝💃Dance</h1>

<div align="center">

[![Public Deployment](https://img.shields.io/badge/Demo-waggledance.ai-blue?style=flat&logo=world&logoColor=white)](https://waggledance.ai)
![milestone](https://img.shields.io/badge/pre%20mvp-%20)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
![CI](https://github.com/agi-merge/waggle-dance/actions/workflows/ci.yml/badge.svg?event=push)
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fagi-merge%2Fwaggle-dance&env=NEXTAUTH_URL,OPENAI_API_KEY,WEAVIATE_HOST,WEAVIATE_API_KEY,WEAVIATE_SCHEME,LONG_TERM_MEMORY_INDEX_NAME,KV_URL,KV_REST_API_URL,KV_REST_API_TOKEN,KV_REST_API_READ_ONLY_TOKEN,POSTGRES_PRISMA_URL,POSTGRES_URL_NON_POOLING,EDGE_CONFIG,EDGE_CONFIG_WRITE&project-name=waggle-dance&repository-name=waggle-dance" alt="Deploy with Vercel"><img src="https://vercel.com/button" height="20" /></a>
<br/>
[![Join Discord Server](https://dcbadge.vercel.app/api/server/ttt9YmhQU6?style=flat)](https://discord.gg/ttt9YmhQU6)
[![GitHub Repo stars](https://img.shields.io/github/stars/agi-merge/waggle-dance?style=social)](https://github.com/agi-merge/waggle-dance)

</div>

<p align="center">
  <a href="https://www.waggledance.ai">🍯 Demo<a> |
  <a href="#-highlighted-features">🦚Features</a> |
  <a href="#-roadmap">📍Roadmap</a> |
  <a href="#%EF%B8%8F-contribute-and-help">🛠️Contribute</a> |
  <a href="#-running-locally-and-development">🏃Run Locally</a> |
  <a href="#-open-core">🌺Open Core</a>
</p>

**Waggle Dance** is an experimental application focused on achieving user-specified goals. It provides a friendly but opinionated user interface for building agent-based systems. The project focuses on explainability, observability, concurrent generation, and exploration. Currently in pre-alpha, the development philosophy prefers experimentation over stability as goal-solving and Agent systems are rapidly evolving.

Waggle Dance takes a goal and passes it to a **Planner Agent** which streams an execution graph for sub-tasks. Each sub-task is executed as concurrently as possible by **Execution Agents**. To reduce poor results and hallucinations, sub-results are reviewed by **Criticism Agents**. Eventually, the **Human in the loop (you!)** will be able to chat with individual Agents and provide course-corrections if needed.

It was originally inspired by [Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT), and has concurrency features similar to those found in [gpt-researcher](https://github.com/assafelovic/gpt-researcher). Therefore, core tenets of the project include _speed_, _accuracy_, _observability_, and _simplicity_. Additionally, many other agentic systems are written in Python, so this project acts as a small counter-balance, and is accessible to the large number of Javascript developers.

An (unstable) API is also available via [tRPC](packages/api/src/root.ts) as well an API [implemented within Next.js](apps/nextjs/src/pages/api). The client-side is mostly responsible for orchestrating and rendering the agent executions, while the API and server-side executes the agents and stores the results. This architecture is likely to be adjusted in the future.

<p align="center">

<img src="https://github.com/agi-merge/waggle-dance/assets/906671/3380a442-05d9-48be-920f-21e9e6d8ce41" height="640" />

</p>
</div>

# 🦚 Highlighted Features

- LLMs go brrr… Highly concurrent execution graph. Some sub-task branches are not dependent, and can run concurrently.
- Adversarial agents that review results.
- Vector database for long-term memory.
- Explainable results and responsive UI: Graph visualizer, sub-task (agent) results, agent logs and events.

## 🥞 Tech Stack

Typescript ﹒ Langchain.js ﹒ T3 ﹒ Prisma ﹒ tRPC ﹒ Weaviate ﹒ Postgres ﹒ OpenAI API ﹒ MUI Joy

## 📍 Roadmap

[Live Project Roadmap Board](https://github.com/orgs/agi-merge/projects/1/views/1) ﹒ <a href="#🛠️-contribute-and-help">🛠️Contribute</a>

- Implement Graph of Thoughts architecture
- Human-in-the-loop (e.g. chat to provide course-corrections, chat freely with agents/chains)
- Loop detection (in-chain review)
- Support for Local LLMs and other LLM APIs such as LLaMa-2, Azure Private OpenAI, Claude, etc.
- Recalled skills a la Voyager/PolyGPT
- Agent data connections, e.g. GitHub, Google Drive, Databases, etc.
- Execution notifications (e.g. Slack, Email, etc.)
- Further execution methods and blends (e.g. Tree of thought, ongoing research)

Future

- Execution notifications (e.g. Slack, Email, etc.)
- Further execution methods and blends (e.g. Tree of thought, ongoing research)
- Desktop and mobile apps
- Migrate to from Next.js Pages structure to App structure
- Consider removing langchain
- Improved architecture for running agents
- Templates and sharing

## 🏃 Running Locally and Development

~~Waggle Dance can be deployed using Docker or manually using Node.js. Configuration of `.env` vars is required.~~
Docker support is coming soon.

### Docker (coming soon)

`docker-compose build && docker-compose up`

### Dependencies

- [Node JS LTS](https://nodejs.org/en)
- [pnpm](https://pnpm.io/installation)
- Turbo - `pnpm add turbo --global` or use `npx turbo` in place of `turbo` below.

### ⚙️ Environment

- Copy `.env.example` to `.env` and configure the environment variables.

### 🐘 Primary Database

The T3 stack includes Prisma. Currently we are using Postgres. The database is used as the source-of-truth of the state of an app deployment. E.g. sessions, accounts, any saved goals/results, etc.

Note that this is different than the user's uploaded documents, however it may store metadata about the documents.

```bash
pnpm db:generate
pnpm db:push
```

- `db:generate` creates the local typings and DB info from the schema.prisma file (`./packages/db/prisma/schema.prisma`).
- `db:push` pushes the schema to the database provider (PostgreSQL by default).
- Run these commands on first install and whenever you make changes to the schema.

### Run Development

This is a T3 stack. [You can check the boilerplate documentation](/docs/create-t3-boilerplate.md)

```bash
turbo dev
```

## 🦑 Linting

Make sure you install the recommended extensions in the solution, particularly `es-lint`.

Linting is run on each build and can fail builds.

To get a full list of linting errors run:

```bash
turbo lint
```

Some of these may be able to be auto-fixed with:

```bash
turbo lint:fix
```

for the rest, you will need to open the associated file and fix the errors yourself. Limit `ts-ignore` for extreme cases.

As a best practice, run `turbo lint` before starting a feature and after finishing a feature and fix any errors before sending a `PR`.

## 🛠️ Contribute and help

- Devs: [CONTRIBUTING.md](CONTRIBUTING.md)
- If you are not technical, you can still help improving documentation or add examples or share your user-stories with our community; any help or contribution is welcome!

## Contributors

<a href="https://github.com/agi-merge/waggle-dance/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=agi-merge/waggle-dance&max=100&columns=5" />
</a>

## 📚 Helpful Docs

- [See all markdown included in the project for more specifics!](https://github.com/search?q=repo%3Aagi-merge%2Fwaggle-dance+path%3A*.md&type=code)

#### Reading List

- [GPT best practices](https://platform.openai.com/docs/guides/gpt-best-practices)
- [Jerry Liu (LLama Index) on state & history of Agentic AI, context management](https://podcasts.apple.com/us/podcast/the-twiml-ai-podcast-formerly-this-week-in-machine/id1116303051?i=1000612216800)
- [Join the discord](https://discord.gg/ttt9YmhQU6)
- [Using AI Agents to Solve Complex Problems](https://haystack.deepset.ai/blog/introducing-haystack-agents)
- [Examples of Prompt Based Apps](https://chatgpt-prompt-apps.com/)
- [Another Example of a Prompt Based App](https://github.com/Significant-Gravitas/Auto-GPT)
- [Python Notebook/Cookbook for Tinkering/Exploring](https://github.com/openai/openai-cookbook/blob/main/apps/chatbot-kickstarter/powering_your_products_with_chatgpt_and_your_data.ipynb)
- [Constitutional AI in RLHF](https://astralcodexten.substack.com/p/constitutional-ai-rlhf-on-steroids)
- [Understand different types of memory and vector database techniques](https://www.pinecone.io/learn/hnsw/)
- [Interaction Nets](https://readonly.link/articles/https://cdn.inet.cic.run/docs/articles/programming-with-interaction-nets.md)

## 🎖️ Citations

- https://github.com/AGI-Edgerunners/Plan-and-Solve-Prompting
- https://github.com/ysymyth/tree-of-thought-llm
- Everything in Helpful Docs above

## 🤗 Special Thanks

- Maintainers and Contributors of Langchain.js
- Maintainers and Contributors of AutoGPT, AgentGPT
- big-AGI
- more...

## 🌺 Open Core

The applications, packages, libraries, and the entire monorepo are freely available under the MIT license. The development process is open, and everyone is welcome to join. In the future, we may choose to develop extensions that are licensed for commercial use.
