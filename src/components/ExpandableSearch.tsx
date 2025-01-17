// ExpandableSearch.tsx
import React, {useEffect, useState} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {Searchbar, useTheme} from 'react-native-paper';
import {truncateString} from '@helpers/formatters';
import {fontStyles, spacingStyles} from '@styles/common';

interface ExpandableSearchProps {
  visible: boolean;
  placeholder?: string;
  applySearch?: (searchText: string) => void;
  noMargin?: boolean;
}

const ExpandableSearch = ({
  visible = false,
  placeholder = 'Search name, phone...',
  applySearch = () => {},
  noMargin = false,
}: ExpandableSearchProps) => {
  const [animation] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [animation, visible]);

  const onSubmit = () => {
    applySearch(searchQuery);
  };

  const onClear = () => {
    setSearchQuery('');
  };

  return (
    <Animated.View
      style={[
        {
          height: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 56], //adjust based on searchbar height
          }),
        },
        styles.container,
      ]}>
      {visible && (
        <View>
          <Searchbar
            placeholder={truncateString(placeholder, 40)}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onBlur={onSubmit} // Apply search
            onClearIconPress={onClear} //Clear Search Query
            autoFocus={visible} // Auto focus when visible
            iconColor={theme.colors.onSecondary}
            rippleColor={theme.colors.secondary}
            style={[
              {backgroundColor: theme.colors.secondary},
              styles.searchbar,
              noMargin ? null : spacingStyles.mh16,
            ]}
            inputStyle={[
              theme.fonts.bodyLarge,
              fontStyles.regularText,
              {color: theme.colors.onSecondary},
              styles.searchbarInput,
            ]}
            theme={{
              colors: {
                primary: theme.colors.primary, // cursor color/selection color
                onSurface: theme.colors.onPrimary, // placeholder text color
              },
            }}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  searchbar: {
    height: 40,
    marginVertical: 8,
  },
  searchbarInput: {
    alignSelf: 'center',
    // height: 40,
    // minHeight: 40,
  },
});

export default ExpandableSearch;
