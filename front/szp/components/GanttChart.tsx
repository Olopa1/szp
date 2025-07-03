import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import FusionCharts from 'react-native-fusioncharts';

interface TaskDataShort {
  id: number;
  taskName: string;
  deadlineDate: string;  // ISO date
  estimatedWorkTime: string; // np. "3d" lub liczba dni do deadline — można użyć do wyliczenia endu
  // Dodaj inne pola jeśli potrzebujesz
}

// Helper do formatowania dat na mm/dd/yyyy wymagany przez FusionCharts
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export default function UserTasksGanttChart() {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ścieżka do pliku fusioncharts.html - konieczne dla react-native-fusioncharts
  const libraryPath = Platform.select({
    ios: require('../assets/fusioncharts.html'), // popraw ścieżkę do twojego pliku
    android: { uri: 'file:///android_asset/fusioncharts.html' },
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8082/api/task/getUserTasks', {
          params: { id: 1, page: 0, size: 100, sortBy: 'SORT_BY_DEADLINE_DATE' },
          headers: { Authorization: `Bearer ${authToken}` },
        });

        // Przyjmujemy, że response.data.groupedTasks to obiekt z tablicami zadań
        const tasks: TaskDataShort[] = Object.values(response.data.groupedTasks).flat() as TaskDataShort[];

        if (tasks.length === 0) {
          setError('Brak zadań do wyświetlenia.');
          setLoading(false);
          return;
        }

        // Przekształć zadania na dane do Gantta
        // W FusionCharts Gantt mamy: tasks.task[] z {start, end} i processes.process[] z labelami
        const processes = tasks.map((task) => ({ label: task.taskName }));

        // Dla uproszczenia end ustawimy na deadline, start na jakiś dzień przed (np. 3 dni przed deadline)
        // lub jeśli masz estimatedWorkTime, można lepiej to wyliczyć
        const tasksForChart = tasks.map((task) => {
          const end = formatDate(task.deadlineDate);
          // Start = deadline minus 3 dni (prosty przykład)
          const startDate = new Date(task.deadlineDate);
          startDate.setDate(startDate.getDate() - 3);
          const start = formatDate(startDate.toISOString());
          return { start, end };
        });

        // Kategorie (miesiące) - wyciągamy zakres dat z zadań
        const minDate = new Date(Math.min(...tasks.map(t => new Date(t.deadlineDate).getTime())));
        const maxDate = new Date(Math.max(...tasks.map(t => new Date(t.deadlineDate).getTime())));
        // Zakres minimalny to od początku miesiąca minDate do końca miesiąca maxDate
        const startMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const endMonth = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);

        const categories = [
          {
            category: [
              {
                start: formatDate(startMonth.toISOString()),
                end: formatDate(endMonth.toISOString()),
                label: startMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
              },
            ],
          },
        ];

        setDataSource({
          chart: {
            dateformat: 'mm/dd/yyyy',
            caption: 'Harmonogram zadań użytkownika',
            theme: 'fusion', // lub 'candy'
            canvasborderalpha: '40',
            ganttlinealpha: '50',
          },
          tasks: {
            color: '#5D62B5',
            task: tasksForChart,
          },
          processes: {
            headertext: 'Zadania',
            headeralign: 'left',
            fontsize: '14',
            isbold: '0',
            align: 'left',
            process: processes,
          },
          categories: categories,
        });

        setLoading(false);
      } catch (e) {
        setError('Błąd podczas pobierania zadań');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{error}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FusionCharts
        type="gantt"
        width="100%"
        height="300"
        dataFormat="json"
        dataSource={dataSource}
        libraryPath={libraryPath}
      />
    </View>
  );
}