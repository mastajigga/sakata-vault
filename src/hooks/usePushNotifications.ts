"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
    return subscription;
  }

  async function subscribe() {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error("Push notifications are not supported");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/push/vapid-key');
      const { publicKey } = await response.json();

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Save to Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: session.user.id,
          subscription: subscription.toJSON()
        });

      if (error) throw error;
      
      setIsSubscribed(true);
      setPermission(Notification.permission);
    } catch (error) {
      console.error("Failed to subscribe to push notifications", error);
    }
  }

  return { permission, isSubscribed, subscribe };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
