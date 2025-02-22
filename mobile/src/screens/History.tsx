import { useCallback, useState } from 'react'
import { Heading, VStack, SectionList, Text, useToast } from 'native-base'

import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { Loading } from '@components/Loading'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useFocusEffect } from '@react-navigation/native'
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO'
import { OneSignal } from 'react-native-onesignal'

export function History() {
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])
  function tagUserInfoCreate(){
    OneSignal.User.addTags({
      last_exercise: exercises
    })
  }
  const toast = useToast()
  async function fetchHistory(){
    try {
    setIsLoading(true)
    const response = await api.get('/history')
    setExercises(response.data)
  } catch (error) {
    const isAppError = error instanceof AppError
    const title = isAppError ? error.message : 'Não foi possível registrar o exercício. Tente mais tarde.'
    toast.show({
      title,
      placement: 'top',
      bgColor: 'red.500'
    })
  } finally{
    setIsLoading(false)
  }
  }
  useFocusEffect(useCallback(() => {
    fetchHistory()
  },[]))

  return (
   <VStack flex={1}>
    <ScreenHeader title="Histórico de Exercícios"/>
    { isLoading ? <Loading/> :   
      <SectionList 
        sections={exercises}
        keyExtractor={item => item.id} 
        renderItem={({item}) =>(
          <HistoryCard data={item}/>
        )}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" fontFamily="heading" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={exercises.length === 0 && { flex:1, justifyContent: 'center' }}
        ListEmptyComponent={() => 
        <Text color="gray.100" textAlign="center">
          Não há exercícios registrados ainda. {'\n'}
          Vamos fazer exercícios hoje?
        </Text>}
        />
      }
  
   </VStack>
  )
}