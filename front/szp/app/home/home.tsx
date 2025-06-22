import Navbar from "@/components/Navbar";
import TaskCard, { TaskDataShort } from "@/components/TaskTile";
import { UserOption } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface GroupedTasksPage {
  content: {
    [status: string]: TaskDataShort[];
  };
  page: number;
  totalPages: number;
  totalElements: number;
}

const statusLabels: Record<string, string> = {
  TASK_TO_DO: "Do zrobienia",
  TASK_IN_PROGRESS: "W trakcie",
  TASK_WAITING_FOR_ACCEPT: "Czeka na akceptację",
  TASK_REJECTED: "Odrzucone",
  TASK_DONE: "Zrobione",
  TASK_HALTED: "Wstrzymane",
};

const PAGE_SIZE = 5;

export default function DisplayMyTasks() {
  const [data, setData] = useState<GroupedTasksPage>({
    content: {},
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [userData, setUserData] = useState<UserOption | null>(null);
  const fetchTasks = async (page: number) => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) throw new Error("Brak tokenu autoryzacji");
      
      
      const response = await axios.get("http://localhost:8082/api/task/getUserTasks", {
        params: {
          id: 1, // <-- podmień na właściwy ID użytkownika
          page: page,
          size: PAGE_SIZE,
          sortBy: "SORT_BY_DEADLINE_DATE",
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Fetched tasks:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const goToNextPage = () => {
    if (data && page < data.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  if (loading || !data) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <>
      <Navbar />
      <ScrollView style={styles.container}>
        {data && data.content &&
            Object.entries(data.content).map(([status, tasks]) => (
                <View key={status}>
                <Text>{statusLabels[status] || status}</Text>
                <FlatList
                    data={tasks}
                    horizontal
                    renderItem={({ item }) => <TaskCard task={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />
                </View>
            ))
            }

        {/* Global pagination buttons */}
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={goToPrevPage}
            disabled={page === 0}
            style={[styles.pageButton, page === 0 && styles.disabledButton]}
          >
            <Text style={styles.pageButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.pageText}>{page + 1} / {data.totalPages}</Text>

          <TouchableOpacity
            onPress={goToNextPage}
            disabled={page >= data.totalPages - 1}
            style={[styles.pageButton, page >= data.totalPages - 1 && styles.disabledButton]}
          >
            <Text style={styles.pageButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  pageButton: {
    padding: 8,
    marginHorizontal: 12,
    backgroundColor: "#3b82f6",
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: "#cbd5e1",
  },
  pageButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "500",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});