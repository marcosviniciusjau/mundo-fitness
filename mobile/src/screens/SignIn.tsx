import { useNavigation } from "@react-navigation/native"
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base"

import { AuthNavigatorProps } from '@routes/auth.routes'

import { useAuth } from "@hooks/useAuth"
import LogoSvg from '@assets/logo_academia.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from "@components/Input"
import { Button } from "@components/Button"
import { Controller, useForm } from "react-hook-form"
import { AppError } from "@utils/AppError"
type FormData = {
  email: string
  password: string
}
export function SignIn() {
  const { signIn } = useAuth()
  const toast = useToast()

  const navigation = useNavigation<AuthNavigatorProps>()
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      await signIn(email,password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'
      if(title === 'Não existe uma conta nesse e-mail'){
        navigation.navigate('signUp')
      }
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <VStack flex={1} px={10} pb={16}>
    
        <Center my={24}>
          <LogoSvg width={102} height={40} />
          <Text color="gray.100" fontSize="xl" mb={4} fontFamily="heading"  fontWeight="bold">Mundo Fitness</Text>
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo.
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse a conta
          </Heading>
          <Controller 
            control={control}
            name="email"
            rules={{ required: 'Informe o e-mail' }}
            render={({ field: { onChange } }) => (
              <Input 
                placeholder="E-mail" 
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
          
          <Controller 
            control={control}
            name="password"
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <Input 
                placeholder="Senha" 
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button 
           title="Acessar"
           onPress={handleSubmit(handleSignIn)}
           isLoading={isSubmitting}
           />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button 
            title="Criar Conta" 
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}