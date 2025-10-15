import React, { useState } from 'react';
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
  Menu,
  Divider
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createPayment } from '../services/dataService';
import { PaymentMethod } from '../types';

const PaymentsScreen: React.FC = () => {
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [paymentFor, setPaymentFor] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!memberId.trim()) {
      newErrors.memberId = 'Το ID μέλους είναι υποχρεωτικό';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Το ποσό είναι υποχρεωτικό';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Μη έγκυρο ποσό';
    }

    if (!paymentFor.trim()) {
      newErrors.paymentFor = 'Η περιγραφή είναι υποχρεωτική';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await createPayment({
        member_id: memberId.trim(),
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        payment_for: paymentFor.trim(),
        payment_date: paymentDate,
        notes: notes.trim() || undefined
      });

      Alert.alert('Επιτυχία', 'Η πληρωμή καταχωρήθηκε επιτυχώς!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setMemberId('');
            setAmount('');
            setPaymentFor('');
            setNotes('');
            setPaymentDate(new Date());
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αποτυχία καταχώρισης πληρωμής');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPaymentDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Στοιχεία Πληρωμής</Title>

            <TextInput
              label="ID Μέλους *"
              value={memberId}
              onChangeText={setMemberId}
              mode="outlined"
              style={styles.input}
              error={!!errors.memberId}
              placeholder="Εισάγετε το ID του μέλους"
            />
            {errors.memberId && (
              <HelperText type="error">{errors.memberId}</HelperText>
            )}

            <TextInput
              label="Ποσό (€) *"
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              style={styles.input}
              keyboardType="decimal-pad"
              error={!!errors.amount}
              placeholder="0.00"
            />
            {errors.amount && (
              <HelperText type="error">{errors.amount}</HelperText>
            )}

            <TextInput
              label="Για (Περιγραφή) *"
              value={paymentFor}
              onChangeText={setPaymentFor}
              mode="outlined"
              style={styles.input}
              error={!!errors.paymentFor}
              placeholder="π.χ. Μηνιαία Συνδρομή Οκτωβρίου 2025"
            />
            {errors.paymentFor && (
              <HelperText type="error">{errors.paymentFor}</HelperText>
            )}

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              Ημερομηνία: {paymentDate.toLocaleDateString('el-GR')}
            </Button>

            {showDatePicker && (
              <DateTimePicker
                value={paymentDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Τρόπος Πληρωμής</Title>

            <SegmentedButtons
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              buttons={[
                {
                  value: PaymentMethod.CASH,
                  label: 'Μετρητά',
                  icon: 'cash'
                },
                {
                  value: PaymentMethod.CARD,
                  label: 'Κάρτα',
                  icon: 'credit-card'
                }
              ]}
              style={styles.segmentedButtons}
            />

            <SegmentedButtons
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              buttons={[
                {
                  value: PaymentMethod.BANK_TRANSFER,
                  label: 'Τράπεζα',
                  icon: 'bank'
                },
                {
                  value: PaymentMethod.OTHER,
                  label: 'Άλλο',
                  icon: 'dots-horizontal'
                }
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Σημειώσεις</Title>

            <TextInput
              label="Σημειώσεις"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Σύνοψη</Title>
            <View style={styles.summaryRow}>
              <Title style={styles.summaryLabel}>Σύνολο:</Title>
              <Title style={styles.summaryAmount}>
                €{amount ? parseFloat(amount).toFixed(2) : '0.00'}
              </Title>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            icon="cash-check"
          >
            Καταχώριση Πληρωμής
          </Button>
        </View>
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
  dateButton: {
    marginTop: 8,
    marginBottom: 8
  },
  segmentedButtons: {
    marginBottom: 8
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#E3F2FD'
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#1976D2'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 20,
    color: '#1976D2'
  },
  summaryAmount: {
    fontSize: 28,
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32
  },
  submitButton: {
    paddingVertical: 8,
    backgroundColor: '#4CAF50'
  }
});

export default PaymentsScreen;
