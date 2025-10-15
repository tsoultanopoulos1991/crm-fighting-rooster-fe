import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Text, List, Switch, Button } from 'react-native-paper';
import { checkExpiringSubscriptions } from '../services/dataService';
import { Subscription } from '../types';
import { format, differenceInDays } from 'date-fns';
import { el } from 'date-fns/locale';

const NotificationsScreen: React.FC = () => {
  const [autoNotifications, setAutoNotifications] = useState(true);
  const [expiring7Days, setExpiring7Days] = useState(true);
  const [expiring3Days, setExpiring3Days] = useState(true);
  const [expiryDay, setExpiryDay] = useState(true);
  const [overdue, setOverdue] = useState(false);

  const [expiringSubscriptions, setExpiringSubscriptions] = useState<Subscription[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadExpiringSubscriptions = async () => {
    const subs = await checkExpiringSubscriptions();
    setExpiringSubscriptions(subs);
  };

  useEffect(() => {
    loadExpiringSubscriptions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpiringSubscriptions();
    setRefreshing(false);
  };

  const handleTestNotification = () => {
    // Simulate sending test notification
    alert('Δοκιμαστική ειδοποίηση στάλθηκε!');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Ρυθμίσεις Ειδοποιήσεων</Title>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Αυτόματες Ειδοποιήσεις</Text>
              <Switch value={autoNotifications} onValueChange={setAutoNotifications} />
            </View>

            <Text style={styles.settingDescription}>
              Ενεργοποίηση αυτόματων ειδοποιήσεων για λήξη συνδρομών
            </Text>
          </Card.Content>
        </Card>

        {autoNotifications && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Τύποι Ειδοποιήσεων</Title>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>7 ημέρες πριν τη λήξη</Text>
                <Switch value={expiring7Days} onValueChange={setExpiring7Days} />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>3 ημέρες πριν τη λήξη</Text>
                <Switch value={expiring3Days} onValueChange={setExpiring3Days} />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Ημέρα λήξης</Text>
                <Switch value={expiryDay} onValueChange={setExpiryDay} />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>3 ημέρες μετά τη λήξη</Text>
                <Switch value={overdue} onValueChange={setOverdue} />
              </View>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>SMS Provider</Title>

            <List.Item
              title="Viber"
              description="Δεν έχει ρυθμιστεί"
              left={props => <List.Icon {...props} icon="message-text" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />

            <List.Item
              title="Email Provider"
              description="Gmail - Δεν έχει ρυθμιστεί"
              left={props => <List.Icon {...props} icon="email" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>
              Συνδρομές που Λήγουν Σύντομα
            </Title>

            {expiringSubscriptions.length === 0 ? (
              <Text style={styles.emptyText}>
                Δεν υπάρχουν συνδρομές που λήγουν τις επόμενες 7 ημέρες
              </Text>
            ) : (
              expiringSubscriptions.map(sub => {
                const daysLeft = differenceInDays(sub.end_date, new Date());

                return (
                  <List.Item
                    key={sub.id}
                    title={`Μέλος: ${sub.member_id}`}
                    description={`Λήγει σε ${daysLeft} ημέρες - ${format(
                      sub.end_date,
                      'dd/MM/yyyy',
                      { locale: el }
                    )}`}
                    left={props => <List.Icon {...props} icon="alert-circle" color="#FF9800" />}
                    style={styles.listItem}
                  />
                );
              })
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              icon="bell-ring"
              onPress={handleTestNotification}
              style={styles.testButton}
            >
              Αποστολή Δοκιμαστικής Ειδοποίησης
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  settingLabel: {
    fontSize: 16,
    color: '#333'
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 8
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16
  },
  testButton: {
    marginTop: 8
  }
});

export default NotificationsScreen;
