import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ArticleCardProps {
  title: string;
  date?: string;
  read?: string;
  imageSource?: any;
}

export default function ArticleCard({ title, date, read, imageSource }: ArticleCardProps) {
  return (
    <Pressable style={articleCardStyles.container}>
      {imageSource ? (
        <Image source={imageSource} style={articleCardStyles.articleImage} />
      ) : (
        <View style={articleCardStyles.imagePlaceholder}>
          <MaterialCommunityIcons name="image-outline" size={30} color="#B0B0B0" />
        </View>
      )}
      <View style={articleCardStyles.content}>
        <Text style={articleCardStyles.title} numberOfLines={2}>{title}</Text>
        <View style={articleCardStyles.metaRow}>
          <Text style={articleCardStyles.metaText}>{date}</Text>
          <Text style={articleCardStyles.metaText}>{read}</Text>
        </View>
      </View>
      <Pressable style={articleCardStyles.bookmarkButton}>
        <MaterialCommunityIcons name="bookmark" size={24} color="#3C72F2" />
      </Pressable>
    </Pressable>
  );
}

const articleCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  articleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginRight: 12,
  },
  bookmarkButton: {
    padding: 4,
  },
});
