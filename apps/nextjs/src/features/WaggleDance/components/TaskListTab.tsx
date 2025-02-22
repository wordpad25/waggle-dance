// TaskListTab.tsx
import React from "react";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";

import { type TaskState } from "@acme/agent";
import { type DraftExecutionEdge, type DraftExecutionNode } from "@acme/db";

import TaskListItem from "./TaskListItem";

type TaskListTabProps = {
  sortedTaskStates: TaskState[];
  nodes: DraftExecutionNode[];
  edges: DraftExecutionEdge[];
  statusColor: (
    n: TaskState,
  ) => "danger" | "success" | "warning" | "primary" | "neutral" | undefined;
  isRunning: boolean;
  taskListRef: React.RefObject<HTMLUListElement>;
  listItemsRef: React.MutableRefObject<HTMLLIElement[]>;
};

export const TaskListTab = ({
  sortedTaskStates,
  nodes,
  edges,
  statusColor,
  isRunning,
  taskListRef,
  listItemsRef,
}: TaskListTabProps) => {
  return (
    <List aria-label="Task list" size="sm" ref={taskListRef}>
      {sortedTaskStates.map((t, i) => (
        <React.Fragment key={t.id}>
          <TaskListItem
            task={t}
            nodes={nodes}
            edges={edges}
            i={i}
            statusColor={statusColor}
            listItemsRef={listItemsRef}
            isRunning={isRunning}
          />
          {i !== sortedTaskStates.length - 1 && (
            <ListDivider inset="gutter" sx={{ margin: 1.5 }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default TaskListTab;
