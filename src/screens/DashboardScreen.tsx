import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, DataTable, Button, Surface, Text } from 'react-native-paper';
import { getDashboardStats } from '../services/dataService';
import { DashboardStats } from '../types';

const DashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text>Φόρτωση...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <Title style={styles.header}>Fighting Rooster Athens</Title>
        <Paragraph style={styles.subtitle}>Διαχείριση Γυμναστηρίου</Paragraph>

        {/* Summary Cards */}
        <View style={styles.cardsRow}>
          <Card style={[styles.card, styles.cardGreen]}>
            <Card.Content>
              <Title style={styles.cardNumber}>{stats.activeMembers}</Title>
              <Paragraph style={styles.cardLabel}>Ενεργά Μέλη</Paragraph>
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.cardOrange]}>
            <Card.Content>
              <Title style={styles.cardNumber}>{stats.expiringSoon}</Title>
              <Paragraph style={styles.cardLabel}>Λήγουν Σύντομα</Paragraph>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.cardsRow}>
          <Card style={[styles.card, styles.cardRed]}>
            <Card.Content>
              <Title style={styles.cardNumber}>{stats.expired}</Title>
              <Paragraph style={styles.cardLabel}>Ληγμένες</Paragraph>
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.cardBlue]}>
            <Card.Content>
              <Title style={styles.cardNumber}>{stats.totalMembers}</Title>
              <Paragraph style={styles.cardLabel}>Σύνολο Μελών</Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Financial Summary */}
        <Card style={styles.financialCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Οικονομική Επισκόπηση</Title>

            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Έσοδα Μήνα:</Text>
              <Text style={styles.financialValue}>€{stats.monthlyRevenue.toFixed(2)}</Text>
            </View>

            <View style={styles.financialRow}>
              <Text style={[styles.financialLabel, styles.debtLabel]}>Οφειλές:</Text>
              <Text style={[styles.financialValue, styles.debtValue]}>€{stats.totalDebt.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Γρήγορες Ενέργειες</Title>

            <Button
              mode="contained"
              icon="account-plus"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Νέο Μέλος
            </Button>

            <Button
              mode="contained"
              icon="cash-register"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Καταχώριση Πληρωμής
            </Button>

            <Button
              mode="contained"
              icon="bullhorn"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Μαζική Ανακοίνωση
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666'
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 4
  },
  cardGreen: {
    backgroundColor: '#4CAF50'
  },
  cardOrange: {
    backgroundColor: '#FF9800'
  },
  cardRed: {
    backgroundColor: '#f44336'
  },
  cardBlue: {
    backgroundColor: '#2196F3'
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  cardLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 4
  },
  financialCard: {
    marginBottom: 16,
    elevation: 4
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  financialLabel: {
    fontSize: 16,
    color: '#333'
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  debtLabel: {
    color: '#666'
  },
  debtValue: {
    color: '#f44336'
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 4
  },
  actionButton: {
    marginVertical: 6
  }
});

export default DashboardScreen;
