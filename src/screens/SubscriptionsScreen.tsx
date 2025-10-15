import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Text, List, Chip } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { getCalendarEvents } from '../services/dataService';
import { CalendarEvent, SubscriptionStatus } from '../types';
import { format, startOfMonth } from 'date-fns';
import { el } from 'date-fns/locale';

const SubscriptionsScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loadEvents = async (month: Date) => {
    const data = await getCalendarEvents(month);
    setEvents(data);

    // Create marked dates object for calendar
    const marked: any = {};

    data.forEach(event => {
      const dateStr = format(event.date, 'yyyy-MM-dd');

      if (!marked[dateStr]) {
        marked[dateStr] = {
          marked: true,
          dots: []
        };
      }

      // Add dot with color based on subscription status
      let dotColor = '#2196F3';
      if (event.subscription.status === SubscriptionStatus.EXPIRING_SOON) {
        dotColor = '#FF9800';
      } else if (event.subscription.status === SubscriptionStatus.EXPIRED) {
        dotColor = '#f44336';
      }

      marked[dateStr].dots.push({
        color: dotColor
      });
    });

    // Highlight selected date
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = '#2196F3';
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#e0e0e0'
      };
    }

    setMarkedDates(marked);
  };

  useEffect(() => {
    loadEvents(currentMonth);
  }, [currentMonth]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents(currentMonth);
    setRefreshing(false);
  };

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);

    const newMarked = { ...markedDates };

    // Remove previous selection
    Object.keys(newMarked).forEach(key => {
      if (newMarked[key].selected) {
        delete newMarked[key].selected;
        delete newMarked[key].selectedColor;
      }
    });

    // Add new selection
    if (newMarked[day.dateString]) {
      newMarked[day.dateString].selected = true;
      newMarked[day.dateString].selectedColor = '#2196F3';
    } else {
      newMarked[day.dateString] = {
        selected: true,
        selectedColor: '#e0e0e0'
      };
    }

    setMarkedDates(newMarked);
  };

  const onMonthChange = (month: DateData) => {
    const newMonth = new Date(month.year, month.month - 1, 1);
    setCurrentMonth(newMonth);
  };

  const getEventsForSelectedDate = (): CalendarEvent[] => {
    return events.filter(
      event => format(event.date, 'yyyy-MM-dd') === selectedDate
    );
  };

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return '#4CAF50';
      case SubscriptionStatus.EXPIRING_SOON:
        return '#FF9800';
      case SubscriptionStatus.EXPIRED:
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusLabel = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return 'Ενεργή';
      case SubscriptionStatus.EXPIRING_SOON:
        return 'Λήγει Σύντομα';
      case SubscriptionStatus.EXPIRED:
        return 'Ληγμένη';
      default:
        return 'Άγνωστη';
    }
  };

  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <Card style={styles.calendarCard}>
          <Card.Content>
            <Calendar
              current={selectedDate}
              onDayPress={onDayPress}
              onMonthChange={onMonthChange}
              markingType={'multi-dot'}
              markedDates={markedDates}
              theme={{
                todayTextColor: '#2196F3',
                selectedDayBackgroundColor: '#2196F3',
                dotColor: '#2196F3',
                selectedDotColor: '#ffffff',
                arrowColor: '#2196F3'
              }}
            />
          </Card.Content>
        </Card>

        <Card style={styles.legendCard}>
          <Card.Content>
            <Title style={styles.legendTitle}>Υπόμνημα</Title>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Ενεργές</Text>

              <View style={[styles.legendDot, { backgroundColor: '#FF9800', marginLeft: 16 }]} />
              <Text style={styles.legendText}>Λήγουν Σύντομα</Text>

              <View style={[styles.legendDot, { backgroundColor: '#f44336', marginLeft: 16 }]} />
              <Text style={styles.legendText}>Ληγμένες</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.eventsCard}>
          <Card.Content>
            <Title style={styles.eventsTitle}>
              {format(new Date(selectedDate), 'dd MMMM yyyy', { locale: el })}
            </Title>

            {selectedDateEvents.length === 0 ? (
              <Text style={styles.noEventsText}>
                Δεν υπάρχουν συνδρομές που λήγουν αυτή την ημέρα
              </Text>
            ) : (
              selectedDateEvents.map(event => (
                <List.Item
                  key={event.id}
                  title={`${event.member.first_name} ${event.member.last_name}`}
                  description={`${event.package.name} - €${event.subscription.final_price}`}
                  left={props => <List.Icon {...props} icon="account" />}
                  right={() => (
                    <Chip
                      style={{
                        backgroundColor: getStatusColor(event.subscription.status)
                      }}
                      textStyle={{ color: '#fff', fontSize: 11 }}
                    >
                      {getStatusLabel(event.subscription.status)}
                    </Chip>
                  )}
                  style={styles.eventItem}
                />
              ))
            )}
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Σύνοψη Μήνα</Title>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Συνολικές Λήξεις:</Text>
              <Text style={styles.summaryValue}>{events.length}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Λήγουν Σύντομα:</Text>
              <Text style={[styles.summaryValue, { color: '#FF9800' }]}>
                {events.filter(e => e.subscription.status === SubscriptionStatus.EXPIRING_SOON).length}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Αναμενόμενα Έσοδα:</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                €{events.reduce((sum, e) => sum + e.subscription.final_price, 0).toFixed(2)}
              </Text>
            </View>
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
  calendarCard: {
    marginBottom: 16,
    elevation: 4
  },
  legendCard: {
    marginBottom: 16,
    elevation: 2
  },
  legendTitle: {
    fontSize: 16,
    marginBottom: 12
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6
  },
  legendText: {
    fontSize: 12,
    color: '#666'
  },
  eventsCard: {
    marginBottom: 16,
    elevation: 2
  },
  eventsTitle: {
    fontSize: 18,
    marginBottom: 12,
    textTransform: 'capitalize'
  },
  noEventsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 24
  },
  eventItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  }
});

export default SubscriptionsScreen;
