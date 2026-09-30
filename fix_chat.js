const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'screens', 'ChatScreen.tsx');
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace(
  "import { MaterialCommunityIcons } from '@expo/vector-icons';",
  "import { MaterialCommunityIcons } from '@expo/vector-icons';\nimport * as ImagePicker from 'expo-image-picker';\nimport * as DocumentPicker from 'expo-document-picker';\nimport * as Contacts from 'expo-contacts';"
);

// Add handler functions
const handlers = 
  const pickImage = async () => {
    setShowAttachmentMenu(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      Alert.alert('Image Selected', 'You selected an image to send.');
    }
  };

  const pickDocument = async () => {
    setShowAttachmentMenu(false);
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      Alert.alert('Document Selected', 'You selected a document to send.');
    }
  };

  const pickContact = async () => {
    setShowAttachmentMenu(false);
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      Alert.alert('Contacts Access', 'You would pick a contact here.');
    } else {
      Alert.alert('Permission Denied', 'Unable to access contacts.');
    }
  };
;
content = content.replace(
  "const handleBack = () => {",
  handlers + "\n  const handleBack = () => {"
);

// Replace dummy onPress in attachment menu
content = content.replace(
  /onPress=\{\(\) => \{ Alert\.alert\('Document', 'Opening document picker\.\.\.'\); setShowAttachmentMenu\(false\); \}\}/g,
  "onPress={pickDocument}"
);
content = content.replace(
  /onPress=\{\(\) => \{ Alert\.alert\('Gallery', 'Opening gallery\.\.\.'\); setShowAttachmentMenu\(false\); \}\}/g,
  "onPress={pickImage}"
);
content = content.replace(
  /onPress=\{\(\) => \{ Alert\.alert\('Contact', 'Opening contacts\.\.\.'\); setShowAttachmentMenu\(false\); \}\}/g,
  "onPress={pickContact}"
);

fs.writeFileSync(file, content);
console.log('Updated ChatScreen');
