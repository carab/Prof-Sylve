export function selectAuth(store) {
  return store.auth;
}

export function selectProfile(store) {
  return store.profile;
}

export function selectUi(store) {
  return store.ui;
}

export function selectCurrentUsername(store) {
  return selectUi(store).currentUsername;
}

export function selectCurrentPokedex(store) {
  return selectUi(store).currentPokedex;
}

export function selectCurrentBox(store) {
  return selectUi(store).currentBox;
}

export function selectCurrentPokemon(store) {
  return selectUi(store).currentPokemon;
}
