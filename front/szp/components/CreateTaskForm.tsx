import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type TaskFormData = {
  taskName: string;
  taskDescription: string;
  projectId: string;
  assignedToUserIds: string;
  assignedFromUserId: string;
  startDate: Date;
  deadline: Date;
  status: string;
  parentTaskId: string;
  priority: string;
};

export default function TaskForm({ onSubmit }: { onSubmit: (data: TaskFormData) => void }) {
  const { control, handleSubmit } = useForm<TaskFormData>();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nazwa zadania</Text>
      <Controller
        control={control}
        name="taskName"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Nazwa zadania" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Opis zadania</Text>
      <Controller
        control={control}
        name="taskDescription"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Opis zadania"
            value={value}
            onChangeText={onChange}
            multiline
          />
        )}
      />

      <Text style={styles.label}>ID projektu</Text>
      <Controller
        control={control}
        name="projectId"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} keyboardType="numeric" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Użytkownicy przypisani (ID, przecinki)</Text>
      <Controller
        control={control}
        name="assignedToUserIds"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Np. 1,2,3" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Zlecone przez (ID użytkownika)</Text>
      <Controller
        control={control}
        name="assignedFromUserId"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} keyboardType="numeric" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Data rozpoczęcia</Text>
      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange, value } }) => (
          <DatePicker
            selected={value}
            onChange={(date: Date | null) => {if(date) onChange(date)}}
            dateFormat="yyyy-MM-dd"
            className="react-datepicker"
          />
        )}
      />

      <Text style={styles.label}>Termin końcowy</Text>
      <Controller
        control={control}
        name="deadline"
        render={({ field: { onChange, value } }) => (
          <DatePicker
            selected={value}
            onChange={(date: Date | null) => {if(date) onChange(date)}}
            dateFormat="yyyy-MM-dd"
            className="react-datepicker"
          />
        )}
      />

      <Text style={styles.label}>Status</Text>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange} style={styles.input}>
            <Picker.Item label="Do zrobienia" value="TO_DO" />
            <Picker.Item label="W trakcie" value="IN_PROGRESS" />
            <Picker.Item label="Skończone" value="DONE" />
            <Picker.Item label="Czeka na akceptację" value="WAITING_FOR_ACCEPT" />
            <Picker.Item label="Odrzucone" value="REJECTED" />
            <Picker.Item label="Wstrzymane" value="HALTED" />
          </Picker>
        )}
      />

      <Text style={styles.label}>Priorytet (1 - 100)</Text>
      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} keyboardType="numeric" value={value} onChangeText={onChange} />
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Zapisz zadanie" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    width: 800,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
});