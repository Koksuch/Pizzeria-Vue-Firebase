<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import router from '@/router'
import { RoutesInfo } from '@/helpers/enums'
import { FirebaseError } from 'firebase/app'
import { mdiEmailOutline, mdiEye, mdiEyeOff, mdiLockOutline } from '@mdi/js'
import { rules } from '@/helpers/validationRules'

const form = ref(false)
const loginCredentials = ref({
  email: '',
  password: '',
})
const errorMsg = ref('')
const isLoading = ref(false)
const isShowingPassword = ref(false)

const onSubmit = () => {
  login()
}

const login = async () => {
  try {
    errorMsg.value = ''
    isLoading.value = true
    const response = await signInWithEmailAndPassword(
      auth,
      loginCredentials.value.email,
      loginCredentials.value.password,
    )
    router.push(RoutesInfo.home.path)
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.log('error', error.code)
      switch (error.code) {
        case 'auth/invalid-email':
          errorMsg.value = 'Niepoprawny email.'
          break
        case 'auth/invalid-credential':
          errorMsg.value = 'Niepoprawne dane logowania.'
          break
        default:
          errorMsg.value = 'Coś poszło nie tak. Spróbuj ponownie.'
      }
    } else {
      errorMsg.value = 'Coś poszło nie tak. Spróbuj ponownie.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="m-auto w-[450px] rounded-lg p-10 shadow-xl">
    <v-form class="flex flex-col gap-5" v-model="form" @submit.prevent="onSubmit">
      <v-text-field
        v-model="loginCredentials.email"
        name="email"
        label="Email"
        id="email"
        placeholder="Type email"
        :rules="[rules.required]"
        variant="solo-filled"
        :prepend-inner-icon="mdiEmailOutline"
        clearable
      >
      </v-text-field>

      <v-text-field
        v-model="loginCredentials.password"
        name="password"
        label="Hasło"
        id="password"
        placeholder="Wpisz hasło"
        :type="isShowingPassword ? 'text' : 'password'"
        :rules="[rules.required]"
        variant="solo-filled"
        :prepend-inner-icon="mdiLockOutline"
        :append-inner-icon="isShowingPassword ? mdiEyeOff : mdiEye"
        clearable
        @click:append-inner="isShowingPassword = !isShowingPassword"
      >
      </v-text-field>
      <p class="font-bold text-red-500" v-if="errorMsg">{{ errorMsg }}</p>
      <v-btn
        :disabled="!form"
        color="blue"
        size="large"
        type="submit"
        variant="elevated"
        block
        :loading="isLoading"
      >
        Zaloguj
      </v-btn>
      <p class="text-center">
        Nie masz konta?
        <RouterLink class="text-blue-500 underline" :to="RoutesInfo.register.path"
          >Rejestracja</RouterLink
        >
      </p>
    </v-form>
  </div>
</template>
