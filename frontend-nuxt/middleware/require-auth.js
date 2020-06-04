export default function ({ store, redirect }) {
  if (store.getters['auth/isLoggedIn']() === false) {
    return redirect('/')
  }
}
