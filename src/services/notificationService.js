// services/notificationService.js
class NotificationService {
  constructor() {
    this.permission = null;
    this.checkPermission();
  }

  async checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;

      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission();
      }
    }
  }

  showMedicationReminder(task) {
    if (this.permission === 'granted') {
      const notification = new Notification(`💊 Medication Reminder: ${task.title}`, {
        body: `Time to take your ${task.title}`,
        icon: '/favicon.ico',
        tag: task.id,
        requireInteraction: true,
        actions: [
          {
            action: 'complete',
            title: 'Mark Complete'
          },
          {
            action: 'snooze',
            title: 'Remind in 15 min'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  }

  showCompletionConfirmation(task) {
    if (this.permission === 'granted') {
      new Notification('✅ Medication Taken', {
        body: `Great! You've taken ${task.title}`,
        icon: '/favicon.ico'
      });
    }
  }
}

export default new NotificationService();
