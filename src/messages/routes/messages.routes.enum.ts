export enum MessageRoutesEnum {
  INIT = 'init',
  POST_MESSAGE = 'post-message',
  GET_MESSAGES = 'get-messages',
  ACTIVE_USERS = ':session_id/active-users',
  SEARCH_MESSAGES = 'search-messages',
  PRIVATE_MESSAGES = 'private-messages',
  ADD_USER_TO_PUBLIC = 'add-user-public/:session_id',
  ADD_USER_TO_PRIVATE = 'add-user-private/:session_id',
  REMOVE_USER = 'remove-user/:session_id',
}
