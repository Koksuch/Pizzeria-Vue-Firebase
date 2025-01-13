<script setup lang="ts">
import { ref } from 'vue'
import { auth, db } from '@/firebase'
import router from '@/router'
import { RoutesInfo } from '@/helpers/enums'
import { FirebaseError } from 'firebase/app'
import { mdiEmailOutline, mdiEye, mdiEyeOff, mdiLockOutline } from '@mdi/js'
import { rules } from '@/helpers/validationRules'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const form = ref(false)
const registerCredentials = ref({
  email: '',
  password: '',
  repeatPassword: '',
})
const errorMsg = ref('')
const isLoading = ref(false)
const isShowingPassword = ref(false)
const isShowingRepeatPassword = ref(false)

const onSubmit = () => {
  register()
}

const register = async () => {
  if (registerCredentials.value.password !== registerCredentials.value.repeatPassword) {
    errorMsg.value = 'Hasła nie są takie same.'
    return
  }
  try {
    errorMsg.value = ''
    isLoading.value = true
    const response = await createUserWithEmailAndPassword(
      auth,
      registerCredentials.value.email,
      registerCredentials.value.password,
    )
    await setDoc(doc(db, 'Users', response.user.uid), {
      roles: ['client'],
    })

    router.push(RoutesInfo.home.path)
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.log('error', error.code)
      switch (error.code) {
        case 'auth/invalid-email':
          errorMsg.value = 'Niepoprawny email.'
          break
        case 'auth/email-already-in-use':
          errorMsg.value = 'Email jest już w użyciu.'
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
        v-model="registerCredentials.email"
        name="email"
        label="Email"
        id="email"
        placeholder="Wpisz email"
        :rules="[rules.required, rules.email]"
        variant="solo-filled"
        :prepend-inner-icon="mdiEmailOutline"
        clearable
      />

      <v-text-field
        v-model="registerCredentials.password"
        name="password"
        label="Hasło"
        id="password"
        placeholder="Wpisz hasło"
        :type="isShowingPassword ? 'text' : 'password'"
        :rules="[rules.required, (v) => rules.minLength(v, 8)]"
        variant="solo-filled"
        :prepend-inner-icon="mdiLockOutline"
        :append-inner-icon="isShowingPassword ? mdiEyeOff : mdiEye"
        clearable
        @click:append-inner="isShowingPassword = !isShowingPassword"
      />
      <v-text-field
        v-model="registerCredentials.repeatPassword"
        name="repeatPassword"
        label="Powtórz Hasło"
        id="repeatPassword"
        placeholder="Powtórz hasło"
        :type="isShowingRepeatPassword ? 'text' : 'password'"
        :rules="[rules.required, (v) => rules.minLength(v, 8)]"
        variant="solo-filled"
        :prepend-inner-icon="mdiLockOutline"
        :append-inner-icon="isShowingRepeatPassword ? mdiEyeOff : mdiEye"
        clearable
        @click:append-inner="isShowingRepeatPassword = !isShowingRepeatPassword"
      />
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
        Zarejestruj
      </v-btn>
      <p class="text-center">
        Masz już konto?
        <RouterLink class="text-blue-500 underline" :to="RoutesInfo.login.path"
          >Logowanie</RouterLink
        >
      </p>
    </v-form>
  </div>
</template>
