export default function ({ store, redirect }) {
  if (store.getters['auth/isLoggedIn']() === true) {
    return redirect('/')
  }
}
