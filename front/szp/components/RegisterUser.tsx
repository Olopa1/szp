import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // lub inny UI lib
import { Input } from 'react-native-elements';
import 'react-native-get-random-values';
import * as yup from 'yup';

interface FormData{
    username : string;
    password : string;
    firstName : string;
    lastName : string;
    email : string;
    phone : string;
    role : number;
    isUserActive : boolean;

}

const schema = yup.object({
  username: yup
    .string()
    .required("Nazwa użytkownika jest wymagana!")
    .min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki")
    .max(20, "Nazwa użytkownika może mieć maksymalnie 20 znaków"),

  password: yup
    .string()
    .required("Hasło jest wymagane!")
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .matches(/[A-Z]/, "Hasło musi zawierać wielką literę")
    .matches(/[a-z]/, "Hasło musi zawierać małą literę")
    .matches(/[0-9]/, "Hasło musi zawierać cyfrę"),

  email: yup
    .string()
    .required("Email jest wymagany!")
    .email("Nieprawidłowy adres email"),

  firstName: yup
    .string()
    .required("Imię jest wymagane")
    .max(30, "Imię może mieć maksymalnie 30 znaków"),

  lastName: yup
    .string()
    .required("Nazwisko jest wymagane")
    .max(30, "Nazwisko może mieć maksymalnie 30 znaków"),

  phone: yup
    .string()
    .required("Numer telefonu jest wymagany")
    .matches(/^\d{9}$/, "Numer telefonu musi mieć dokładnie 9 cyfr"),

  role: yup
    .number()
    .required("Rola jest wymagana")
    .oneOf([0, 1, 2], "Nieprawidłowa rola użytkownika"),

  isUserActive: yup
    .boolean()
    .required("Status aktywności użytkownika jest wymagany"),
});

export default function RegisterForm({onRegister} : {onRegister: ()=> void}){
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            role: 0,
            isUserActive: false,
        }
    });

    const onSubmit = async (data: FormData) => {
        try{
            const response = await axios.post("http://localhost:8082/api/auth/signup",{
                ...data
            });
            
            const token = response.data;
            await AsyncStorage.setItem("authToken", token);
            onRegister();
        }catch(error : any){
            if(error.response?.status === 409){
                Alert.alert("Bład", "użytkownik istnieje");
            }else if(axios.isAxiosError(error)){
                Alert.alert("Błąd logowania", error.response?.data?.message || "Wystąpił błąd");
            }else{
                Alert.alert("Bład", "Nieoczekiwany błąd");
            }
        }
    };  

    const roleOptions = [
      { label: 'Użytkownik', value: 0 },
      { label: 'Moderator', value: 1 },
      { label: 'Administrator', value: 2 },
    ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rejestracja użytkownika</Text>

      {/* Pola tekstowe */}
      {[
        { name: 'username', label: 'Nazwa użytkownika' },
        { name: 'password', label: 'Hasło', secureTextEntry: true },
        { name: 'email', label: 'Email' },
        { name: 'firstName', label: 'Imię' },
        { name: 'lastName', label: 'Nazwisko' },
        { name: 'phone', label: 'Telefon' },
      ].map(({ name, label, secureTextEntry }) => (
        <Controller
          key={name}
          control={control}
          name={name as keyof FormData}
          render={({ field: { onChange, value } }) => (
            <Input
              label={label}
              placeholder={`Wpisz ${label.toLowerCase()}`}
              value={value.toString()}
              onChangeText={onChange}
              errorMessage={errors[name as keyof FormData]?.message}
              secureTextEntry={secureTextEntry}
            />
          )}
        />
      ))}

      {/* Picker do wyboru roli */}
      <Text style={styles.label}>Rola</Text>
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={styles.label}>Rola</Text>
            <Dropdown
              style={styles.dropdown}
              data={roleOptions}
              labelField="label"
              valueField="value"
              placeholder="Wybierz rolę"
              value={value}
              onChange={item => onChange(item.value)}
            />
            {errors.role && <Text style={styles.error}>{errors.role.message}</Text>}
          </>
        )}
      />
      {errors.role && <Text style={styles.error}>{errors.role.message}</Text>}

      {/* Przełącznik aktywności */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Czy aktywny?</Text>
        <Controller
          control={control}
          name="isUserActive"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} />
          )}
        />
      </View>

      <Button title="Zarejestruj się" onPress={handleSubmit(onSubmit)} color="#007bff" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
    dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 10,
  },
});