<template>
  <div class="form-container">
    <form
      @submit.prevent="isEditing ? applyEditing() : addCurrentValuesToDb()"
    >
      <label for="userNameInput">User Name</label>
      <input
        v-model="userName"
        id="userNameInput"
        type="text"
        :disabled="isEditing || isLoading"
      >
      <label for="emailInput">Email</label>
      <input
        v-model="email"
        id="emailInput"
        type="text"
        :disabled="isLoading"
      >
      <input
        v-if="!isEditing"
        type="submit"
        value="Add"
        :disabled="isLoading || !userName || !email"
      >
      <template v-else>
        <input
          type="submit"
          value="Save"
          :disabled="isLoading || !userName || !email"
        >
        <input
          type="button"
          value="Cancel"
          :disabled="isLoading"
          @click="cancelEditing"
        >
      </template>
    </form>
  </div>

  <div
    v-if="error"
    class="error-message"
  >{{ error }}</div>

  <div class="table-container">
    <table>
      <tr>
        <th>User name</th>
        <th>Email</th>
        <th></th>
      </tr>
      <tr
        v-for="user of users"
        :key="`table-row-user${user.userName}`"
      >
        <td>{{ user.userName }}</td>
        <td>{{ user.email }}</td>
        <td>
          <button
            :disabled="isLoading"
            @click="edit(user)"
          >Edit</button>
          <button
            :disabled="isLoading"
            @click="deleteUser(user.userName)"
          >Delete</button>
        </td>
      </tr>
    </table>
    <div
      v-if="isLoading"
      class="loading"
    >Loading...</div>
  </div>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from 'vue'
import { LocalDb } from '../services/local-db'

interface User {
  userName: string
  email: string
}

const db = new LocalDb<User>({
  dbName: 'users',
  keyPath: 'userName',
  indexes: [{
    keyPath: 'email',
    unique: true
  }]
})

const error = ref('')
const isLoading = ref(false)
const users = ref<User[]>([])
const userName = ref('')
const email = ref('')
const isEditing = ref(false)

async function addCurrentValuesToDb () {
  const success = await handleDbAction(db.add({
    userName: userName.value,
    email: email.value
  }))
  if (success) {
    userName.value = ''
    email.value = ''
  }
}

async function openDb () {
  isLoading.value = true
  try {
    await db.open()
    users.value = await db.getAll()
  } catch (err: any) {
    error.value = err.message
  }
  isLoading.value = false
}

function edit (user: User) {
  isEditing.value = true
  userName.value = user.userName
  email.value = user.email
}

function cancelEditing () {
  isEditing.value = false
  userName.value = ''
  email.value = ''
}

async function applyEditing () {
  await handleDbAction(db.edit({
    userName: userName.value,
    email: email.value
  }))

  cancelEditing()
}

async function deleteUser (userName: string) {
  await handleDbAction(db.delete(userName))
}

async function handleDbAction (action: Promise<any>) {
  error.value = ''
  isLoading.value = true
  let success = true
  try {
    await action
    users.value = await db.getAll()
  } catch (err: any) {
    error.value = err.message
    success = false
  }
  isLoading.value = false
  return success
}

onBeforeUnmount(() => {
  db.close()
})

openDb()
</script>

<style scoped>
  .form-container {
      display: flex;
  }

  input[type=text] {
      width: 100%;
      margin: 8px 0;
  }

  table {
      border-collapse: collapse;
  }

  th, td {
      padding: 8px;
      border: 1px solid gray;
  }

  .error-message {
      color: red;
      margin: 16px;
  }

  .table-container {
      margin-top: 24px;
      position: relative;
      width: fit-content;
  }

  .loading {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      text-align: center;
      padding-top: 16px;
      font-weight: bold;
      background-color: rgba(255, 255, 255, .6);
  }

  button + button {
      margin-left: 8px;
  }
</style>
