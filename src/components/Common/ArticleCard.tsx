import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export interface ArticleCardProps {
  title: string;
  date?: string;
  read?: string;
  imageSource?: any;
}

export default function ArticleCard({ title, date, read, imageSource }: ArticleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@saved_articles').then(data => {
      if (data) {
        const articles = JSON.parse(data);
        const exists = articles.some((a: any) => a.title === title);
        if (exists) setIsBookmarked(true);
      }
    });
  }, [title]);

  const toggleBookmark = async () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    try {
      const data = await AsyncStorage.getItem('@saved_articles');
      let articles = data ? JSON.parse(data) : [];
      
      if (newState) {
        articles.push({ id: Date.now().toString(), type: 'Article', name: title, date, readTime: read, imageSource });
      } else {
        articles = articles.filter((a: any) => a.name !== title);
      }
      await AsyncStorage.setItem('@saved_articles', JSON.stringify(articles));
    } catch (e) {
      console.log('Error saving article', e);
    }
  };

  return (
    <Pressable style={articleCardStyles.container}>
      {imageSource ? (
        <Image source={imageSource} style={articleCardStyles.articleImage} />
      ) : (
        <View style={articleCardStyles.imagePlaceholder}>
          <Ionicons name="image-outline" size={30} color={Colors.colorB0B0B0} />
        </View>
      )}
      <View style={articleCardStyles.content}>
        <Text style={articleCardStyles.title} numberOfLines={2}>{title}</Text>
        <View style={articleCardStyles.metaRow}>
          <Text style={articleCardStyles.metaText}>{date}</Text>
          <Text style={articleCardStyles.metaText}>{read}</Text>
        </View>
      </View>
      <Pressable style={articleCardStyles.bookmarkButton} onPress={toggleBookmark}>
        <Ionicons 
          name={isBookmarked ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color={Colors.color3C72F2} 
        />
      </Pressable>
    </Pressable>
  );
}

const articleCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.colorF0F0F0,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: Colors.color000,
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
    backgroundColor: Colors.border,
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
    color: Colors.color333333,
    marginBottom: 8,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginRight: 12,
  },
  bookmarkButton: {
    padding: 4,
  },
});
