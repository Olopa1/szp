import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useState } from 'react';
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
    .string()
    .required("Rola jest wymagana")
    .oneOf(['ADMIN', 'NORMAL_USER'], "Nieprawidłowa rola użytkownika"),

  isUserActive: yup
    .boolean()
    .required("Status aktywności użytkownika jest wymagany"),
});

export default function RegisterForm({onRegister} : {onRegister: ()=> void}){
    const {
        control,
        handleSubmit,
        formState: {errors},
        reset
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

    const [formSuccess, setFormSuccess] = useState(false);

    const onSubmit = async (data: FormData) => {
        try{
            const response = await axios.post("http://localhost:8082/api/auth/signup",{
                ...data
            });
            
            onRegister();
            reset();
            setFormSuccess(true);
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
      { label: 'Użytkownik', value: 'NORMAL_USER' },
      //{ label: 'Moderator', value: 1 },
      { label: 'Administrator', value: 'ADMIN' },
    ];

  return (
      <ScrollView contentContainerStyle={styles.container}>
        {formSuccess && (  <View style={styles.successMessage}>
    <Text style={styles.successText}>Użytkownik został dodany</Text>
  </View>)}

        <Text style={styles.title}>Dodaj nowego użytkownika</Text>

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
                style={styles.label}
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

        <Button title="Dodaj użytkownika" onPress={handleSubmit(onSubmit)} color="#007bff" />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#1e293b",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 6,
    marginLeft: 4,
  },
  dropdown: {
    height: 50,
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginLeft: 6,
    marginBottom: 8,
  },
  successMessage: {
    backgroundColor: "#d1fae5",
    borderColor: "#10b981",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  successText: {
    color: "#065f46",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});