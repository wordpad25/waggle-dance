// features/WaggleDance/utils/planTasks.ts

import type DAG from "@acme/agent/src/prompts/types/DAG";

import {
  initialNodes,
  rootPlanId,
  type AgentPacket,
  type DAGNode,
  type DAGNodeClass,
  type ModelCreationProps,
} from "../../../../../../packages/agent";
import { type InjectAgentPacketType } from "../types/TaskExecutor";
import { type GraphDataState } from "../types/types";
import { sleep } from "./sleep";

export type PlanTasksProps = {
  goal: string;
  goalId: string;
  executionId: string;
  creationProps: ModelCreationProps;
  graphDataState: GraphDataState;
  log: (...args: (string | number | object)[]) => void;
  injectAgentPacket: InjectAgentPacketType;
  abortSignal: AbortSignal;
  startFirstTask?: (task: DAGNode, dag: DAG) => Promise<void>;
};

export default async function planTasks({
  goal,
  goalId,
  executionId,
  creationProps,
  graphDataState: [dag, setDAG],
  log,
  injectAgentPacket,
  startFirstTask,
  abortSignal,
}: PlanTasksProps): Promise<DAG | undefined> {
  injectAgentPacket({ type: "starting", nodeId: rootPlanId }, dag.nodes[0]!);

  let partialDAG: DAG = dag;
  let hasFirstTaskStarted = false;
  const data = { goal, goalId, executionId, creationProps };
  const res = await fetch("/api/agent/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: abortSignal,
  });

  if (!res.ok) {
    console.error(`Error fetching plan: ${res.status} ${res.statusText}`);
    throw new Error(`Error fetching plan: ${res.status} ${res.statusText}`);
  }
  const stream = res.body;
  let initialNode: DAGNode | DAGNodeClass | undefined;
  if (!stream) {
    throw new Error(`No stream: ${res.statusText} `);
  } else {
    log(`started planning!`);
    initialNode = initialNodes(goal)[0];
    if (initialNode) {
      injectAgentPacket({ type: "working", nodeId: rootPlanId }, initialNode);
    } else {
      log({ type: "error", nodeId: rootPlanId, message: "No initial node" });
      throw new Error("No initial node");
    }
  }

  let postMessageCount = 0;
  const parseWorker = new Worker(new URL("./parseWorker.ts", import.meta.url));

  parseWorker.postMessage({ executionId, initialNodes: initialNodes(goal) });

  parseWorker.onerror = function (event) {
    console.error("parseWorker error", event);
    postMessageCount--;
  };
  parseWorker.onmessageerror = function (event) {
    console.error("parseWorker onmessageerror", event);
    postMessageCount--;
  };
  parseWorker.onmessage = function (
    event: MessageEvent<{
      dag: DAG | null | undefined;
      error: Error | undefined;
      finishPacket: AgentPacket | undefined;
    }>,
  ) {
    postMessageCount--;
    const { dag: newDag, error, finishPacket } = event.data;

    if (!!finishPacket) {
      injectAgentPacket(finishPacket, initialNode!);
      return;
    }

    if (!!error) {
      return;
    }

    if (newDag) {
      const nodesLength = dag?.nodes.length;
      const diffNodesCount = newDag.nodes.length - nodesLength ?? 0;
      const newEdgesCount = newDag.edges.length - (dag?.edges.length ?? 0);
      if (diffNodesCount || newEdgesCount) {
        // slice the new portion and makeServerIdIfNeeded() on each id
        // for (let i = 0; i < diffNodesCount; i++) {
        //   const node = newDag.nodes[nodesLength + i];
        //   if (node) {
        //     node.id = makeServerIdIfNeeded(node.id, executionId);
        //   }
        // }
        // for (let i = 0; i < newEdgesCount; i++) {
        //   const edge = newDag.edges[nodesLength + i];
        //   if (edge) {
        //     edge.sId = makeServerIdIfNeeded(edge.sId, executionId);
        //     edge.tId = makeServerIdIfNeeded(edge.tId, executionId);
        //   }
        // }
        // newDag.nodes
        //   .slice(newDag.nodes.length - diffNodesCount)
        //   .forEach((n) => (n.id = makeServerIdIfNeeded(n.id, executionId)));
        // newDag.edges.slice(newDag.edges.length - newEdgesCount).forEach((e) => {
        //   e.sId = makeServerIdIfNeeded(e.sId, executionId);
        //   e.tId = makeServerIdIfNeeded(e.tId, executionId);
        // });
        // console.debug("newDag", newDag);
        setDAG(newDag);
        partialDAG = newDag;
      }

      const firstNode = newDag.nodes[1];
      if (
        !hasFirstTaskStarted &&
        startFirstTask &&
        firstNode &&
        newDag.nodes.length > 0
      ) {
        hasFirstTaskStarted = true;
        console.log("starting first task", firstNode.id);
        void startFirstTask(firstNode, dag);
      }
    }
  };

  let buffer = Buffer.alloc(0);
  async function streamToString(stream: ReadableStream<Uint8Array>) {
    const decoder = new TextDecoder();
    const transformStream = new TransformStream<Uint8Array, string>({
      transform(chunk, controller) {
        controller.enqueue(decoder.decode(chunk));
      },
    });

    const readableStream = stream.pipeThrough(transformStream);
    const reader = readableStream.getReader();

    let result;
    while ((result = await reader.read()) && result.value) {
      if (abortSignal.aborted) {
        throw new Error("Signal aborted");
      }
      const newData = Buffer.from(result.value);
      const lineBreakIndex = newData.lastIndexOf("\n");

      if (lineBreakIndex !== -1) {
        const completeLine = newData.subarray(0, lineBreakIndex + 1);
        const partialLine = newData.subarray(lineBreakIndex + 1);

        buffer = Buffer.concat([buffer, completeLine]);
        postMessageCount++;
        parseWorker.postMessage({ buffer: buffer.toString(), goal });
        buffer = partialLine;
      } else {
        buffer = Buffer.concat([buffer, newData]);
      }
    }

    if (buffer.length > 0) {
      postMessageCount++;
      parseWorker.postMessage({ buffer: buffer.toString(), goal });
    }

    while (postMessageCount > 0) {
      await sleep(100);
    }
  }

  await streamToString(stream);
  return partialDAG;
}
