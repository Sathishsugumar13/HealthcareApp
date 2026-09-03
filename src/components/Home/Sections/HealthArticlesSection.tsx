import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionHeader from '../../Common/SectionHeader/SectionHeader';
import ArticleCard from '../../Common/ArticleCard/ArticleCard';

interface HealthArticlesSectionProps {
  onSeeAll: () => void;
  articles: Array<any>;
  searchText: string;
}

export default function HealthArticlesSection({ onSeeAll, articles, searchText }: HealthArticlesSectionProps) {
  // Filter the articles based on the search text
  const filteredArticles = articles.filter((article) => {
    return article.title.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <>
      <SectionHeader title="Health article" onSeeAll={onSeeAll} />
      <View style={styles.articlesContainer}>
        {filteredArticles.map((article, index) => (
          <ArticleCard key={index} title={article.title} date={article.date} read={article.read} imageSource={article.imageSource} />
        ))}
        
        {/* Show a message if no articles are found */}
        {filteredArticles.length === 0 && (
           <Text style={styles.listEmptyText}>No articles found.</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  articlesContainer: {
    flexDirection: 'column',
  },
  listEmptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  }
});
