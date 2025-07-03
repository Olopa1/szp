import Navbar from "@/components/Navbar";
import TaskCard, { TaskDataShort } from "@/components/TaskTile";
import { GetUserFromToken, UserOption } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface GroupedTasksPage {
  groupedTasks: {
    [status: string]: TaskDataShort[];
  };
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

interface Comment {
  authorName?: string;
  comment: string;
  commentDate: string;
}

const statusLabels: Record<string, string> = {
  TASK_TO_DO: "Do zrobienia",
  TASK_IN_PROGRESS: "W trakcie",
  TASK_WAITING_FOR_ACCEPT: "Czeka na akceptację",
  TASK_REJECTED: "Odrzucone",
  TASK_DONE: "Zrobione",
  TASK_HALTED: "Wstrzymane",
};

const PAGE_SIZE = 20;
const COMMENTS_PAGE_SIZE = 5;

export default function DisplayMyTasks() {
  const [data, setData] = useState<GroupedTasksPage>({
    groupedTasks: {},
    page: 0,
    size: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [selectedTask, setSelectedTask] = useState<TaskDataShort | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [userData, setUserData] = useState<UserOption | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "SORT_BY_DEADLINE_DATE" | "SORT_BY_PROJECT" | "SORT_BY_ASSIGNED_FROM"
  >("SORT_BY_DEADLINE_DATE");

  // ** Nowe stany dla komentarzy i paginacji **
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);

  

  const fetchTasks = async (page: number) => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) throw new Error("Brak tokenu autoryzacji");

      const response = await axios.get("http://localhost:8082/api/task/getAllTasks", {
        params: {
          page,
          size: PAGE_SIZE,
          sortBy, // <-- dynamiczne sortowanie
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja do pobierania komentarzy z paginacją
  const fetchComments = async (taskId: number, page: number = 0) => {
    setLoadingComments(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) throw new Error("Brak tokenu autoryzacji");

      const response = await axios.get("http://localhost:8082/api/comment/commentsByTaskId", {
        params: {
          taskId,
          page,
          size: COMMENTS_PAGE_SIZE,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Pobrano komentarze:", response.data);
      const data = response.data;
      // Zakładamy strukturę odpowiedzi jako Page<Comment>
      if (page === 0) {
        setComments(data.content);
      } else {
        setComments((prev) => [...prev, ...data.content]);
      }
      setCommentsPage(page);
      setCommentsTotalPages(data.totalPages);
    } catch (err) {
      console.error("Błąd pobierania komentarzy", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page, sortBy]);

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
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setComment("");
          setComments([]);
          setCommentsPage(0);
          setCommentsTotalPages(0);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Szczegóły zadania</Text>
            <Text style={styles.modalText}>Tytuł: {selectedTask?.taskName}</Text>

            {/* === SELEKTOR STATUSU === */}
            {selectedTask && (
              <>
                <Text style={styles.modalText}>Status:</Text>
                <Picker
                  selectedValue={selectedTask.status}
                  style={styles.picker}
                  onValueChange={async (selectedStatus) => {
                    if (!selectedTask) return;

                    const updatedTask = {
                      ...selectedTask,
                      status: selectedStatus as TaskDataShort["status"],
                    };

                    try {
                      const authToken = await AsyncStorage.getItem("authToken");
                      if (!authToken) throw new Error("Brak tokenu");

                      await axios.put(
                        `http://localhost:8082/api/task/update/${updatedTask.id}`,
                        {
                          status: selectedStatus,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${authToken}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );
                      fetchTasks(page); 
                      // Lokalnie aktualizuj stan, gdy backend się uda
                      setSelectedTask(updatedTask);
                    } catch (error) {
                      console.error("Błąd podczas aktualizacji statusu:", error);
                      Alert.alert("Błąd", "Nie udało się zaktualizować statusu zadania.");
                    }
                  }}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <Picker.Item key={value} label={label} value={value} />
                  ))}
                </Picker>
              </>
            )}

            <Text style={styles.modalText}>Termin: {selectedTask?.deadlineDate || "Brak"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Dodaj komentarz..."
              value={comment}
              onChangeText={setComment}
              multiline
            />

            {/* KOMENTARZE */}
            <Text style={{ fontWeight: "600", marginTop: 10, marginBottom: 6 }}>Komentarze:</Text>

            {loadingComments ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <>
                {comments.length === 0 ? (
                  <Text style={{ fontStyle: "italic", color: "#64748b" }}>Brak komentarzy</Text>
                ) : (
                  comments.map((c, idx) => (
                    <View
                      key={idx}
                      style={{ paddingVertical: 4, borderBottomColor: "#e2e8f0", borderBottomWidth: 1 }}
                    >
                      <Text style={{ fontWeight: "bold" }}>{c.authorName || "Anonim"}</Text>
                      <Text>{c.comment}</Text>
                      <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                        {new Date(c.commentDate).toLocaleString()}
                      </Text>
                    </View>
                  ))
                )}
                {commentsPage < commentsTotalPages - 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedTask) fetchComments(selectedTask.id, commentsPage + 1);
                    }}
                    style={{
                      padding: 8,
                      marginTop: 8,
                      backgroundColor: "#3b82f6",
                      borderRadius: 6,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Załaduj więcej komentarzy</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* PRZYCISK DODAWANIA KOMENTARZA */}
            <Pressable
              style={styles.commentButton}
              onPress={async () => {
                try {
                  const authToken = await AsyncStorage.getItem("authToken");
                  if (!authToken) throw new Error("Brak tokenu");
                  const userData = await GetUserFromToken(authToken);
                  if (!userData) throw new Error("Brak danych użytkownika");

                  await axios.post(
                    "http://localhost:8082/api/comment/addComment",
                    {
                      taskId: selectedTask?.id,
                      userId: userData.id,
                      commentDate: new Date().toISOString(),
                      comment: comment,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  setComment("");
                  if (selectedTask) fetchComments(selectedTask.id, 0);
                } catch (err) {
                  console.error("Błąd przy dodawaniu komentarza", err);
                }
              }}
            >
              <Text style={styles.commentButtonText}>Dodaj komentarz</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setComment("");
                setComments([]);
                setCommentsPage(0);
                setCommentsTotalPages(0);
              }}
            >
              <Text style={styles.cancelButtonText}>Zamknij</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Navbar />
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sortuj według:</Text>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSortBy(itemValue);
            setPage(0); // Resetuj stronę na pierwszą
            fetchTasks(0);
          }}
        >
          <Picker.Item label="Termin wykonania" value="SORT_BY_DEADLINE_DATE" />
          <Picker.Item label="Projekt" value="SORT_BY_PROJECT" />
          <Picker.Item label="Przydzielone przez" value="SORT_BY_ASSIGNED_FROM" />
        </Picker>
      </View>
      <ScrollView style={styles.container}>
        {data &&
          data.groupedTasks &&
          Object.entries(data.groupedTasks).map(([status, tasks]) => (
            <View key={status} style={styles.section}>
              <Text style={styles.sectionTitle}>{statusLabels[status] || status}</Text>
              <FlatList
                data={tasks}
                horizontal
                renderItem={({ item }) => (
                  <TaskCard
                    handlePress={() => {
                      setSelectedStatus(item.status);
                      setSelectedTask(item);
                      setModalVisible(true);
                      fetchComments(item.id, 0);
                      setComment("");
                    }}
                    task={item}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          ))}

        {/* Global pagination buttons */}
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={goToPrevPage}
            disabled={page === 0}
            style={[styles.pageButton, page === 0 && styles.disabledButton]}
          >
            <Text style={styles.pageButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.pageText}>
            {page + 1} / {data.totalPages}
          </Text>

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
  sortContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  picker: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    height: 44,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1e293b",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderColor: "#94a3b8",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
  commentButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 8,
    marginTop: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#334155",
    fontSize: 16,
  },
});