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
  HelperText,
  Card
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createMember } from '../services/dataService';
import { Member } from '../types';

interface AddMemberScreenProps {
  navigation: any;
}

const AddMemberScreen: React.FC<AddMemberScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Έκτακτη Επικοινωνία
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Το όνομα είναι υποχρεωτικό';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Το επώνυμο είναι υποχρεωτικό';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Το τηλέφωνο είναι υποχρεωτικό';
    } else if (!/^69\d{8}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Μη έγκυρο ελληνικό κινητό τηλέφωνο';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Μη έγκυρο email';
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
      const memberData: Omit<Member, 'id' | 'age' | 'created_at' | 'updated_at'> = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        date_of_birth: dateOfBirth,
        emergency_contact_name: emergencyContactName.trim() || undefined,
        emergency_contact_relation: emergencyContactRelation.trim() || undefined,
        emergency_contact_phone: emergencyContactPhone.trim() || undefined,
        notes: notes.trim() || undefined
      };

      await createMember(memberData);

      Alert.alert(
        'Επιτυχία',
        'Το μέλος προστέθηκε επιτυχώς!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αποτυχία προσθήκης μέλους');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
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
            <Title style={styles.sectionTitle}>Προσωπικά Στοιχεία</Title>

            <TextInput
              label="Όνομα *"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={styles.input}
              error={!!errors.firstName}
            />
            {errors.firstName && (
              <HelperText type="error">{errors.firstName}</HelperText>
            )}

            <TextInput
              label="Επώνυμο *"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
              error={!!errors.lastName}
            />
            {errors.lastName && (
              <HelperText type="error">{errors.lastName}</HelperText>
            )}

            <TextInput
              label="Τηλέφωνο *"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              error={!!errors.phone}
            />
            {errors.phone && (
              <HelperText type="error">{errors.phone}</HelperText>
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
            />
            {errors.email && (
              <HelperText type="error">{errors.email}</HelperText>
            )}

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              Ημερομηνία Γέννησης: {dateOfBirth.toLocaleDateString('el-GR')}
            </Button>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
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
            <Title style={styles.sectionTitle}>Έκτακτη Επικοινωνία</Title>

            <TextInput
              label="Όνομα Επαφής"
              value={emergencyContactName}
              onChangeText={setEmergencyContactName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Σχέση (π.χ. Πατέρας, Σύζυγος)"
              value={emergencyContactRelation}
              onChangeText={setEmergencyContactRelation}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Τηλέφωνο Επαφής"
              value={emergencyContactPhone}
              onChangeText={setEmergencyContactPhone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
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
              numberOfLines={4}
            />
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Προσθήκη Μέλους
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={loading}
            style={styles.cancelButton}
          >
            Ακύρωση
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
    marginBottom: 16
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32
  },
  submitButton: {
    marginBottom: 12,
    paddingVertical: 6
  },
  cancelButton: {
    paddingVertical: 6
  }
});

export default AddMemberScreen;
