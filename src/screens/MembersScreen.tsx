import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  Searchbar,
  Text,
  Badge
} from 'react-native-paper';
import { getMembersWithSubscriptions } from '../services/dataService';
import { MemberWithSubscription, SubscriptionStatus } from '../types';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface MembersScreenProps {
  navigation: any;
}

const MembersScreen: React.FC<MembersScreenProps> = ({ navigation }) => {
  const [members, setMembers] = useState<MemberWithSubscription[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberWithSubscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadMembers = async () => {
    const data = await getMembersWithSubscriptions();
    setMembers(data);
    setFilteredMembers(data);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMembers();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMembers();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        m =>
          m.first_name.toLowerCase().includes(query.toLowerCase()) ||
          m.last_name.toLowerCase().includes(query.toLowerCase()) ||
          m.phone.includes(query)
      );
      setFilteredMembers(filtered);
    }
  };

  const getStatusColor = (status?: SubscriptionStatus) => {
    if (!status) return '#9e9e9e';
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return '#4CAF50';
      case SubscriptionStatus.EXPIRING_SOON:
        return '#FF9800';
      case SubscriptionStatus.EXPIRED:
        return '#f44336';
      case SubscriptionStatus.SUSPENDED:
        return '#757575';
      case SubscriptionStatus.CANCELLED:
        return '#424242';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusLabel = (status?: SubscriptionStatus) => {
    if (!status) return 'Χωρίς Συνδρομή';
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return 'Ενεργή';
      case SubscriptionStatus.EXPIRING_SOON:
        return 'Λήγει Σύντομα';
      case SubscriptionStatus.EXPIRED:
        return 'Ληγμένη';
      case SubscriptionStatus.SUSPENDED:
        return 'Αναστολή';
      case SubscriptionStatus.CANCELLED:
        return 'Ακυρωμένη';
      default:
        return 'Άγνωστη';
    }
  };

  const renderMember = ({ item }: { item: MemberWithSubscription }) => {
    const status = item.currentSubscription?.status;
    const statusColor = getStatusColor(status);
    const statusLabel = getStatusLabel(status);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('MemberDetails', { memberId: item.id })}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.memberInfo}>
                <Title style={styles.memberName}>
                  {item.first_name} {item.last_name}
                </Title>
                <Paragraph style={styles.memberPhone}>{item.phone}</Paragraph>
              </View>

              <Chip
                style={[styles.statusChip, { backgroundColor: statusColor }]}
                textStyle={styles.statusChipText}
              >
                {statusLabel}
              </Chip>
            </View>

            {item.subscriptionPackage && (
              <View style={styles.packageInfo}>
                <Text style={styles.packageName}>{item.subscriptionPackage.name}</Text>
                {item.currentSubscription && (
                  <Text style={styles.expiryDate}>
                    Λήγει: {format(item.currentSubscription.end_date, 'dd/MM/yyyy', { locale: el })}
                  </Text>
                )}
              </View>
            )}

            {item.totalDebt > 0 && (
              <View style={styles.debtBadge}>
                <Badge style={styles.badge}>Οφειλή: €{item.totalDebt.toFixed(2)}</Badge>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Αναζήτηση μέλους..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredMembers}
        renderItem={renderMember}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Δεν βρέθηκαν μέλη</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddMember')}
        label="Νέο Μέλος"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  searchBar: {
    margin: 16,
    elevation: 4
  },
  listContent: {
    padding: 16,
    paddingTop: 0
  },
  card: {
    marginBottom: 12,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: 18,
    marginBottom: 4
  },
  memberPhone: {
    fontSize: 14,
    color: '#666'
  },
  statusChip: {
    height: 28
  },
  statusChipText: {
    color: '#fff',
    fontSize: 11
  },
  packageInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  packageName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  expiryDate: {
    fontSize: 12,
    color: '#666'
  },
  debtBadge: {
    marginTop: 8,
    alignItems: 'flex-start'
  },
  badge: {
    backgroundColor: '#f44336',
    color: '#fff'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#999'
  }
});

export default MembersScreen;
