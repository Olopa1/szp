import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text } from 'react-native';
import { Input } from 'react-native-elements';
import * as yup from 'yup';

interface FormData{
    username : string;
    password : string;
}

const schema = yup.object().shape({
    username: yup.string().required("Nazwa użytkownika jest wymagana!"),
    password: yup.string().min(6, "Hasło jest za krótkie!").required("Hasło jest wymagane!"),
});


export default function LoginForm({onLogin} : {onLogin: ()=> void}){
    const [error,setError] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: "",
            password: "",
        }
    });

   
  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("http://localhost:8082/api/auth/signin", {
        username: data.username,
        password: data.password,
      });

      if (response.status === 200) {
        const token = response.data;
        await AsyncStorage.setItem("authToken", token);
        setError(false);
        onLogin();
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError(true); // <-- Ustawia error i pokazuje komunikat
        } else if (error.response?.status === 409) {
          Alert.alert("Błąd", "Użytkownik już istnieje");
        } else {
          Alert.alert("Błąd logowania", error.response?.data?.message || "Wystąpił błąd");
        }
      } else {
        Alert.alert("Błąd", "Nieoczekiwany błąd");
      }
    }
  };

  return (
    <>
      <Text style={{ marginBottom: 20, textAlign: 'center' ,fontWeight: 'bold', fontSize: 30}}>
        Logowanie
      </Text>
      {error && (
        <Text style={styles.errorText}>Brak takiego użytkownika sprawdź login lub hasło</Text>
      )}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Username"
            placeholder="Podaj nazwę użytkownika"
            value={value}
            onChangeText={(text)=>{ onChange(text); setError(false);}}
            errorMessage={errors.username?.message}
            autoCapitalize="none"
            keyboardType="default"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Hasło"
            placeholder="Podaj hasło"
            value={value}
            onChangeText={(text)=>{ onChange(text); setError(false);}}
            errorMessage={errors.password?.message}
            secureTextEntry
          />
        )}
      />

      <Button
        title="Zaloguj się"
        onPress={handleSubmit(onSubmit)}
        color="#007bff"
      />
    </>
  );

}

  const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
  },
});

