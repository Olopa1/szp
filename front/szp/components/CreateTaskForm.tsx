import { GetUserFromToken, UserOption } from '@/utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export type TaskFormData = {
  taskName: string;
  taskDescription: string;
  projectId: number;
  assignedToUserIds: number[];
  assignedFromUserId: number;
  startDate: Date;
  deadline: Date;
  status: string;
  parentTaskId: string;
  priority: string;
};

type ProjectOption = {
  projectName: string;
  projectId: number;
};

export default function TaskForm({ onSubmit }: { onSubmit: (data: TaskFormData) => void }) {
  const { control, handleSubmit, setValue } = useForm<TaskFormData>();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [currentUser, setCurrentUser] = useState<UserOption>();
  const handleAddUser = (userId: string) => {
    const user = users.find(u => String(u.id) === userId);
    if (user) {
      setSelectedUsers([...selectedUsers, user]);
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const handleRemoveUser = (userId: number) => {
    const user = selectedUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
      setUsers([...users, user]);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchUserFromToken();
  }, []);

  useEffect(() => {
    const ids = selectedUsers.map(user => user.id);
    setValue('assignedToUserIds', ids);
    setValue('status', 'TO_DO'); // Ustawienie domyślnego statusu
  }, [selectedUsers]);

  const fetchUserFromToken = async () =>{
    try{
      const token = await AsyncStorage.getItem("authToken");
      if(token){
        const data = await GetUserFromToken(token);
      if(data){
        setCurrentUser(data);
        setValue("assignedFromUserId", data.id);  
      }
      }else{
        Alert.alert("Błąd", "Brak tokena autoryzacji");
      }
    }catch(error:any){
      Alert.alert("Błąd", "Nie udało się pobrać użytkownika z tokena");
    }
  }

  const fetchUsers = async () =>{
    try{
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get('http://localhost:8082/api/user/allUsers',{
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = response.data
      setUsers(data);
    }catch(erroe:any){
      Alert.alert("Bład", "Nie udało się pobrać użytkowników");
    }
  }

  const fetchProjects = async () =>{
    try{
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get('http://localhost:8082/api/project/getAllProjectsNames',{
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = response.data
      setProjects(data);
    }catch(erroe:any){
      Alert.alert("Bład", "Nie udało się pobrać projektów");
    }
  }
  return (
    <ScrollView style={styles.container} >
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

      <Text style={styles.label}>Projekt</Text>
      <Controller
        control={control}
        name="projectId"
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange} style={styles.input}>
            <Picker.Item label="Wybierz projekt" value="" />
            {projects.map(project => (
              <Picker.Item
                key={project.projectId}
                label={project.projectName}
                value={String(project.projectId)}
              />
            ))}
          </Picker>
        )}
      />

      <Text style={styles.label}>Użytkownicy do przypisania</Text>
      <Picker
        selectedValue=""
        onValueChange={(value) => {
          if (value) handleAddUser(value);
        }}
        style={styles.input}
      >
        <Picker.Item label="Wybierz użytkownika" value="" />
        {users.map(user => (
          <Picker.Item
            key={user.id}
            label={`${user.firstName !== "no first name specified" ? user.firstName : ""} ${user.lastName || user.userName}`}
            value={String(user.id)}
          />
        ))}
      </Picker>

      <View>
        {selectedUsers.map(user => (
          <View key={user.id} style={styles.selectedUserItem}>
            <Text>{`${user.firstName} ${user.lastName}`}</Text>
            <Button title="Usuń" onPress={() => handleRemoveUser(user.id)} />
          </View>
        ))}
      </View>

      <Text style={styles.label}>Zlecone przez</Text>
      <Controller
        control={control}
        name="assignedFromUserId"
        render={({ field: { value } }) => (
          <>
            <TextInput
              style={styles.input}
              value={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''}
              editable={false}
            />
            <TextInput
              style={{ display: 'none' }}
              value={String(value)}
              editable={false}
            />
          </>
        )}
      />

      <Text style={styles.label}>Data rozpoczęcia</Text>
      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange, value } }) => (
          <DatePicker
            selected={value}
            onChange={(date: Date | null) => { if (date) onChange(date) }}
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
            onChange={(date: Date | null) => { if (date) onChange(date) }}
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
        <Button title="Zapisz zadanie" onPress={handleSubmit(data => {
          const transformedData = {
            ...data,
            assignedToUserIds: data.assignedToUserIds.map(id => Number(id)),
          };
          onSubmit(transformedData);
        })} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,           // <- dodaj to
    padding: 16,
    backgroundColor: '#fff',
    width: '70%',     // zamiast 800, dla responsywności
    textAlign: 'center',
    maxHeight:600,
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
  selectedUserItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 8,
  marginVertical: 4,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  backgroundColor: '#f9f9f9',
}
});