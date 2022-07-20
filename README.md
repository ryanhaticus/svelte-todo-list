# svelte-todo-list

My first rodeo with Svelte. A full todo list application built with SvelteKit, Firebase, and TailwindCSS

## Firestore rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    match /tasks/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
