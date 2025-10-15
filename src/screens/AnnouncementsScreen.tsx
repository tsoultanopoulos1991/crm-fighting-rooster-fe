import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Card,
  SegmentedButtons,
  HelperText,
  RadioButton,
  Text,
  Divider,
  List
} from 'react-native-paper';
import {
  getAllAnnouncements,
  createAnnouncement,
  sendAnnouncement,
  getMembersWithSubscriptions
} from '../services/dataService';
import { TargetType, ChannelType, AnnouncementStatus, Announcement } from '../types';

const AnnouncementsScreen: React.FC = () => {
  const [targetType, setTargetType] = useState<TargetType>(TargetType.ALL_MEMBERS);
  const [channel, setChannel] = useState<ChannelType>(ChannelType.SMS);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recipientCount, setRecipientCount] = useState(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadAnnouncements();
    calculateRecipients();
  }, [targetType]);

  const loadAnnouncements = async () => {
    const data = await getAllAnnouncements();
    setAnnouncements(data);
  };

  const calculateRecipients = async () => {
    const members = await getMembersWithSubscriptions();

    let count = 0;

    switch (targetType) {
      case TargetType.ALL_MEMBERS:
        count = members.length;
        break;
      case TargetType.ACTIVE:
        count = members.filter(m => m.currentSubscription?.status === 'active').length;
        break;
      case TargetType.EXPIRED:
        count = members.filter(m => !m.currentSubscription || m.currentSubscription?.status === 'expired').length;
        break;
      case TargetType.OVERDUE:
        count = members.filter(m => m.totalDebt > 0).length;
        break;
      default:
        count = members.length;
    }

    setRecipientCount(count);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (channel === ChannelType.EMAIL && !subject.trim()) {
      newErrors.subject = 'Το θέμα είναι υποχρεωτικό για email';
    }

    if (!message.trim()) {
      newErrors.message = 'Το μήνυμα είναι υποχρεωτικό';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Το μήνυμα πρέπει να έχει τουλάχιστον 10 χαρακτήρες';
    }

    if (recipientCount === 0) {
      newErrors.recipients = 'Δεν υπάρχουν αποδέκτες για το επιλεγμένο κριτήριο';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!message.trim()) {
      Alert.alert('Σφάλμα', 'Το μήνυμα είναι υποχρεωτικό');
      return;
    }

    setLoading(true);

    try {
      await createAnnouncement({
        target_type: targetType,
        recipient_count: recipientCount,
        subject: subject.trim() || undefined,
        message: message.trim(),
        channel,
        status: AnnouncementStatus.DRAFT,
        successful_count: 0,
        failed_count: 0
      });

      Alert.alert('Επιτυχία', 'Το πρόχειρο αποθηκεύτηκε!');
      loadAnnouncements();

      // Reset form
      setSubject('');
      setMessage('');
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αποτυχία αποθήκευσης');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!validateForm()) {
      return;
    }

    // Confirmation
    const channelName = channel === ChannelType.SMS ? 'SMS' : 'Email';
    const estimatedCost = channel === ChannelType.SMS ? (recipientCount * 0.05).toFixed(2) : '0.00';

    Alert.alert(
      'Επιβεβαίωση Αποστολής',
      `Θα σταλεί ${channelName} σε ${recipientCount} μέλη.\n\nΕκτιμώμενο Κόστος: €${estimatedCost}\n\nΕίστε σίγουροι;`,
      [
        {
          text: 'Ακύρωση',
          style: 'cancel'
        },
        {
          text: 'Αποστολή',
          onPress: async () => {
            setSending(true);

            try {
              const announcement = await createAnnouncement({
                target_type: targetType,
                recipient_count: recipientCount,
                subject: subject.trim() || undefined,
                message: message.trim(),
                channel,
                status: AnnouncementStatus.SENDING,
                successful_count: 0,
                failed_count: 0,
                total_cost: parseFloat(estimatedCost)
              });

              // Simulate sending
              await sendAnnouncement(announcement.id);

              Alert.alert(
                'Επιτυχία',
                `Η ανακοίνωση στάλθηκε επιτυχώς σε ${recipientCount} μέλη!`
              );

              loadAnnouncements();

              // Reset form
              setSubject('');
              setMessage('');
            } catch (error) {
              Alert.alert('Σφάλμα', 'Αποτυχία αποστολής ανακοίνωσης');
            } finally {
              setSending(false);
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Αποδέκτες</Title>

            <RadioButton.Group
              onValueChange={value => setTargetType(value as TargetType)}
              value={targetType}
            >
              <RadioButton.Item label="Όλα τα Μέλη" value={TargetType.ALL_MEMBERS} />
              <RadioButton.Item label="Ενεργά Μέλη" value={TargetType.ACTIVE} />
              <RadioButton.Item label="Ληξιπρόθεσμα" value={TargetType.EXPIRED} />
              <RadioButton.Item label="Μέλη με Οφειλές" value={TargetType.OVERDUE} />
            </RadioButton.Group>

            <View style={styles.recipientCount}>
              <Text style={styles.recipientLabel}>Αριθμός Αποδεκτών:</Text>
              <Text style={styles.recipientNumber}>{recipientCount}</Text>
            </View>

            {errors.recipients && (
              <HelperText type="error">{errors.recipients}</HelperText>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Κανάλι Αποστολής</Title>

            <SegmentedButtons
              value={channel}
              onValueChange={(value) => setChannel(value as ChannelType)}
              buttons={[
                {
                  value: ChannelType.SMS,
                  label: 'SMS',
                  icon: 'message-text'
                },
                {
                  value: ChannelType.EMAIL,
                  label: 'Email',
                  icon: 'email'
                }
              ]}
            />

            {channel === ChannelType.SMS && (
              <Text style={styles.costInfo}>
                Εκτιμώμενο κόστος: €{(recipientCount * 0.05).toFixed(2)} (€0.05 ανά SMS)
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Μήνυμα</Title>

            {channel === ChannelType.EMAIL && (
              <>
                <TextInput
                  label="Θέμα *"
                  value={subject}
                  onChangeText={setSubject}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.subject}
                />
                {errors.subject && (
                  <HelperText type="error">{errors.subject}</HelperText>
                )}
              </>
            )}

            <TextInput
              label="Μήνυμα *"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={8}
              error={!!errors.message}
              placeholder="π.χ. 10 Δεκεμβρίου έχουμε sparring στον Fight Club Athens. Να είσαστε όλοι στις 9 έξω από το γυμναστήριο!"
            />
            {errors.message && (
              <HelperText type="error">{errors.message}</HelperText>
            )}

            <Text style={styles.charCount}>
              Χαρακτήρες: {message.length}
              {channel === ChannelType.SMS && ` (${Math.ceil(message.length / 160)} SMS)`}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSend}
            loading={sending}
            disabled={loading || sending}
            style={styles.sendButton}
            icon="send"
          >
            Αποστολή Τώρα
          </Button>

          <Button
            mode="outlined"
            onPress={handleSaveDraft}
            loading={loading}
            disabled={loading || sending}
            style={styles.draftButton}
            icon="content-save"
          >
            Αποθήκευση Προχείρου
          </Button>
        </View>

        <Divider style={styles.divider} />

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Ιστορικό Ανακοινώσεων</Title>

            {announcements.length === 0 ? (
              <Text style={styles.emptyText}>Δεν υπάρχουν ανακοινώσεις</Text>
            ) : (
              announcements.map(announcement => (
                <List.Item
                  key={announcement.id}
                  title={announcement.subject || announcement.message.substring(0, 50) + '...'}
                  description={`${announcement.recipient_count} αποδέκτες • ${announcement.status}`}
                  left={props => (
                    <List.Icon
                      {...props}
                      icon={announcement.channel === ChannelType.SMS ? 'message-text' : 'email'}
                    />
                  )}
                  style={styles.historyItem}
                />
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 16
  },
  card: {
    marginBottom: 16,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16
  },
  input: {
    marginBottom: 8
  },
  recipientCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8
  },
  recipientLabel: {
    fontSize: 16,
    color: '#1976D2'
  },
  recipientNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2'
  },
  costInfo: {
    marginTop: 12,
    fontSize: 14,
    color: '#FF9800',
    textAlign: 'center'
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24
  },
  sendButton: {
    marginBottom: 12,
    paddingVertical: 6,
    backgroundColor: '#4CAF50'
  },
  draftButton: {
    paddingVertical: 6
  },
  divider: {
    marginVertical: 24
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16
  }
});

export default AnnouncementsScreen;
