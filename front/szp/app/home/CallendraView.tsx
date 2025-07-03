import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

import Navbar from '@/components/Navbar';
import TaskCard, { TaskDataShort } from '@/components/TaskTile';

interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    tasks?: TaskDataShort[];
  };
}

interface TaskDataDetails {
  id: number;
  taskName: string;
  taskDescription: string;
  projectName: string;
  assignedTo: { id: number; userName: string }[];
  assignedFrom: { id: number; userName: string };
  status: string;
  deadline: string;
  estimatedWorkTime: string;
  comments: { id: number; content: string; authorName: string; date: string }[];
  childrenTasks: TaskDataShort[];
  priority: number;
}

export default function DeadlineCalendar() {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDataDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const response = await axios.get("http://localhost:8082/api/task/getUserTasks", {
          params: { id: 1, page: 0, size: 100, sortBy: 'SORT_BY_DEADLINE_DATE' },
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        const tasks: TaskDataShort[] = Object.values(response.data.groupedTasks).flat() as TaskDataShort[];
        const newMarked: MarkedDates = {};

        tasks.forEach((task) => {
          const date = task.deadlineDate?.split("T")[0];
          if (!date) return;

          if (!newMarked[date]) {
            newMarked[date] = {
              marked: true,
              dotColor: '#3b82f6',
              tasks: [],
            };
          }

          newMarked[date].tasks?.push(task);
        });

        setMarkedDates(newMarked);
      } catch (error) {
        console.error("Error fetching tasks for calendar:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleDayPress = (day: { dateString: string }) => {
    const updated = Object.fromEntries(
      Object.entries(markedDates).map(([date, data]) => [
        date,
        { ...data, selected: date === day.dateString, selectedColor: '#3b82f6' },
      ])
    );
    setMarkedDates(updated);
    setSelectedDate(day.dateString);
  };

  const tasksForSelectedDay = selectedDate ? markedDates[selectedDate]?.tasks || [] : [];

  // Funkcja otwierająca modal i pobierająca szczegóły zadania
  const openTaskDetails = async (taskId: number) => {
    setLoadingDetails(true);
    setModalVisible(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`http://localhost:8082/api/task/getTaskById/${taskId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTaskDetails(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setTaskDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <>
      <Navbar />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              selectedDayBackgroundColor: '#3b82f6',
              todayTextColor: '#3b82f6',
            }}
          />

          <Text style={styles.info}>Dot oznacza zadania z deadlinem w danym dniu.</Text>

          {selectedDate && (
            <View style={styles.taskList}>
              <Text style={styles.dateHeader}>Zadania na {selectedDate}:</Text>
              {tasksForSelectedDay.length > 0 ? (
                tasksForSelectedDay.map((task) => (
                    <TaskCard handlePress={()=>openTaskDetails(task.id)} task={task} />
                ))
              ) : (
                <Text style={styles.noTasks}>Brak zadań tego dnia.</Text>
              )}
            </View>
          )}

          {/* Modal z detalami zadania */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Zamknij ✕</Text>
                </Pressable>

                {loadingDetails ? (
                  <Text>Ładowanie...</Text>
                ) : taskDetails ? (
                  <ScrollView>
                    <Text style={styles.modalTitle}>{taskDetails.taskName}</Text>
                    <Text style={styles.modalSubTitle}>Projekt: {taskDetails.projectName}</Text>
                    <Text>Status: {taskDetails.status}</Text>
                    <Text>Deadline: {taskDetails.deadline}</Text>
                    <Text>Opis: {taskDetails.taskDescription || 'Brak opisu'}</Text>

                    <Text style={styles.sectionTitle}>Przydzielone do:</Text>
                    {taskDetails.assignedTo.map(user => (
                      <Text key={user.id}>- {user.userName}</Text>
                    ))}

                    <Text style={styles.sectionTitle}>Przydzielone od:</Text>
                    <Text>{taskDetails.assignedFrom.userName}</Text>

                    <Text style={styles.sectionTitle}>Komentarze:</Text>
                    {taskDetails.comments.length > 0 ? (
                      taskDetails.comments.map(c => (
                        <View key={c.id} style={styles.comment}>
                          <Text style={styles.commentAuthor}>{c.authorName} ({c.date}):</Text>
                          <Text>{c.content}</Text>
                        </View>
                      ))
                    ) : (
                      <Text>Brak komentarzy</Text>
                    )}
                  </ScrollView>
                ) : (
                  <Text>Nie udało się załadować szczegółów zadania.</Text>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  info: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  taskList: {
    marginTop: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noTasks: {
    fontSize: 16,
    color: '#94a3b8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: '80%',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 12,
    fontWeight: '600',
  },
  comment: {
    marginTop: 6,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#3b82f6',
  },
  commentAuthor: {
    fontWeight: '600',
  },
});