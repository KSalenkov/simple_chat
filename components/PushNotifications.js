import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { idClient } from '../constants/thisDevise';
import { channelId } from '../constants/channelNotification'



export default async function registerForPushNotificationsAsync(server) {
  
  const PUSH_ENDPOINT = `http://${server}`;
  
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  
  if (status !== 'granted') {
    alert('No notification permissions!');
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
      idClient: {
        value: idClient,
      },
      channelName: {
        value: channelId,
      }
    }),
  });
}