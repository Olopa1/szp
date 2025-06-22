import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export type TaskStatus =
  | "TASK_HALTED"
  | "TASK_DONE"
  | "TASK_WAITING_FOR_ACCEPT"
  | "TASK_REJECTED"
  | "TASK_IN_PROGRESS"
  | "TASK_TO_DO";

export interface UserDataShort {
  id: number;
  userName: string;
}

export interface TaskDataShort {
  id: number;
  taskName: string;
  projectName: string;
  status: TaskStatus;
  priority: number;
  requestFrom: UserDataShort;
}

interface Props {
  task: TaskDataShort;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  
  const handlePress = () => {
    //navigation.navigate("TaskEdit", { taskId: task.id });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TASK_DONE":
        return "#d1fae5";
      case "TASK_IN_PROGRESS":
        return "#bfdbfe";
      case "TASK_TO_DO":
        return "#fde68a";
      case "TASK_WAITING_FOR_ACCEPT":
        return "#fef3c7";
      case "TASK_REJECTED":
        return "#fecaca";
      case "TASK_HALTED":
        return "#e5e7eb";
      default:
        return "#f3f4f6";
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.card, { backgroundColor: getStatusColor(task.status) }]}>
      <Text style={styles.title}>{task.taskName}</Text>
      <Text style={styles.text}>Projekt: {task.projectName}</Text>
      <Text style={styles.text}>Status: {task.status.replace("TASK_", "").replaceAll("_", " ")}</Text>
      <Text style={styles.text}>Priorytet: {task.priority}</Text>
      <Text style={styles.text}>Zgłoszone przez: {task.requestFrom?.userName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});

export default TaskCard;