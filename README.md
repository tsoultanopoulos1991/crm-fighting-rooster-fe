# Fighting Rooster Gym - Mobile App

Εφαρμογή διαχείρισης γυμναστηρίου για το Fighting Rooster Athens.

## Χαρακτηριστικά

### 1. Dashboard (Αρχική)
- Επισκόπηση στατιστικών
- Ενεργά μέλη, λήξεις, οφειλές
- Έσοδα μήνα
- Γρήγορες ενέργειες

### 2. Μέλη
- Λίστα μελών με αναζήτηση
- Προσθήκη νέων μελών
- Πλήρη προσωπικά στοιχεία
- Στοιχεία έκτακτης επικοινωνίας
- Κατάσταση συνδρομής
- Οφειλές

### 3. Συνδρομές
- Ημερολόγιο με λήξεις συνδρομών
- Οπτική επισκόπηση του μήνα
- Χρωματικοί κωδικοί για ενεργές/λήγουσες/ληγμένες
- Σύνοψη αναμενόμενων εσόδων

### 4. Πληρωμές
- Καταχώριση πληρωμών
- Τρόποι πληρωμής (Μετρητά, Κάρτα, Τράπεζα, Άλλο)
- Περιγραφές και σημειώσεις
- Ιστορικό πληρωμών

### 5. Ανακοινώσεις
- Μαζική αποστολή μηνυμάτων
- Επιλογή αποδεκτών (Όλα, Ενεργά, Ληξιπρόθεσμα, Οφειλές)
- SMS και Email
- Εκτίμηση κόστους SMS
- Ιστορικό ανακοινώσεων
- **Παράδειγμα χρήσης**: "10 Δεκεμβρίου έχουμε sparring στον τάδε σύλλογο. Να είσαστε όλοι στις 9 έξω από το γυμναστήριο!"

### 6. Ειδοποιήσεις
- Αυτόματες ειδοποιήσεις λήξης συνδρομών
- Ρυθμίσεις: 7 ημέρες, 3 ημέρες, ημέρα λήξης
- Λίστα συνδρομών που λήγουν σύντομα
- SMS/Email provider settings

## Εγκατάσταση

### Προαπαιτούμενα
- Node.js (v18+)
- npm ή yarn
- Expo CLI
- Expo Go app στο κινητό σου (για testing)

### Βήματα

1. **Clone το repository**
```bash
cd fighting-rooster-mobile
```

2. **Εγκατάσταση dependencies**
```bash
npm install
```

3. **Εκκίνηση του development server**
```bash
npm start
# ή
npx expo start
```

4. **Άνοιγμα στο κινητό**
- Κατέβασε το "Expo Go" app από το Play Store/App Store
- Σκάναρε το QR code που εμφανίζεται στο terminal
- Η εφαρμογή θα ανοίξει στο κινητό σου

## Scripts

```bash
# Development
npm start          # Εκκίνηση Expo dev server
npm run android    # Εκτέλεση σε Android emulator
npm run ios        # Εκτέλεση σε iOS simulator
npm run web        # Εκτέλεση στο browser

# Build
npm run build      # Build για production
```

## Δομή Project

```
fighting-rooster-mobile/
├── src/
│   ├── types/              # TypeScript types & interfaces
│   │   └── index.ts
│   ├── services/           # Data service layer (mock data)
│   │   └── dataService.ts
│   ├── screens/            # App screens
│   │   ├── DashboardScreen.tsx
│   │   ├── MembersScreen.tsx
│   │   ├── AddMemberScreen.tsx
│   │   ├── SubscriptionsScreen.tsx
│   │   ├── PaymentsScreen.tsx
│   │   ├── AnnouncementsScreen.tsx
│   │   └── NotificationsScreen.tsx
│   ├── components/         # Reusable components
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── utils/             # Utility functions
│   └── constants/         # Constants & config
├── assets/                # Images, fonts, etc
├── App.tsx                # Root component
├── app.json              # Expo configuration
├── package.json
└── tsconfig.json
```

## Τεχνολογίες

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **React Native Paper** - UI components
- **React Native Calendars** - Calendar component
- **date-fns** - Date utilities

## Data Model

Το app χρησιμοποιεί το data model που περιγράφεται στο schema:
- Members (Μέλη)
- Subscriptions (Συνδρομές)
- Subscription Packages (Πακέτα)
- Payments (Πληρωμές)
- Debts (Οφειλές)
- Announcements (Ανακοινώσεις)
- Notifications (Ειδοποιήσεις)

Προς το παρόν χρησιμοποιεί **mock data** για development. Για production θα χρειαστεί:
- Backend API integration
- Database (PostgreSQL όπως στο schema)
- Authentication (Keycloak)
- SMS/Email providers integration

## Επόμενα Βήματα για Production

1. **Backend API**
   - Δημιουργία REST API
   - PostgreSQL database
   - Keycloak authentication

2. **API Integration**
   - Αντικατάσταση mock data με API calls
   - Error handling
   - Loading states

3. **SMS/Email Integration**
   - Viber Business API για SMS
   - Gmail/SendGrid για Email
   - Notification scheduling με cron jobs

4. **Authentication**
   - Keycloak integration
   - Login screen
   - Protected routes
   - Token management

5. **Additional Features**
   - Push notifications
   - Offline support
   - Data sync
   - Reports & analytics
   - PDF exports (receipts, reports)

## Χρήση

### Προσθήκη Νέου Μέλους
1. Πήγαινε στην καρτέλα "Μέλη"
2. Πάτησε το κουμπί "Νέο Μέλος"
3. Συμπλήρωσε τα στοιχεία
4. Πάτησε "Προσθήκη Μέλους"

### Καταχώριση Πληρωμής
1. Πήγαινε στην καρτέλα "Πληρωμές"
2. Συμπλήρωσε το ID μέλους, ποσό, περιγραφή
3. Επίλεξε τρόπο πληρωμής
4. Πάτησε "Καταχώριση Πληρωμής"

### Αποστολή Μαζικής Ανακοίνωσης
1. Πήγαινε στην καρτέλα "Ανακοινώσεις"
2. Επίλεξε αποδέκτες (π.χ. Όλα τα Μέλη)
3. Επίλεξε κανάλι (SMS ή Email)
4. Γράψε το μήνυμα (π.χ. για sparring event)
5. Πάτησε "Αποστολή Τώρα"

### Προβολή Ημερολογίου Λήξεων
1. Πήγαινε στην καρτέλα "Συνδρομές"
2. Δες το ημερολόγιο με τις λήξεις
3. Πάτησε σε μια ημερομηνία για λεπτομέρειες
4. Τα χρωματικά dots δείχνουν την κατάσταση

## Troubleshooting

### Το app δεν εκκινεί
```bash
# Καθάρισμα cache
npx expo start -c
```

### TypeScript errors
```bash
# Επανεγκατάσταση dependencies
rm -rf node_modules
npm install
```

### Navigation issues
- Έλεγξε ότι έχεις εγκαταστήσει όλα τα navigation packages
- Restart το Expo server

## Υποστήριξη

Για ερωτήσεις ή προβλήματα, επικοινώνησε με τον developer.

## License

Proprietary - Fighting Rooster Athens
