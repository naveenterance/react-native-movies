import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { genres } from "../utils/Genres";
import { languages } from "../utils/Languages";
import { years } from "../utils/Years";
import { theme } from "../styles/colors";
import { useTheme } from "../utils/Theme";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const GenreFilter = ({ setGenre }) => {
  const { current } = useTheme();
  const data = genres.map((genre, index) => ({
    label: genre,
    value: index.toString(),
  }));
  const [selected, setSelected] = useState([]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const handleSelectionChange = (selectedItems) => {
    setSelected(selectedItems);

    const selectedGenres = selectedItems.map(
      (item) => data.find((genre) => genre.value === item).label
    );

    setGenre(selectedGenres);
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        style={
          (styles.dropdown,
          {
            backgroundColor: theme[current].white,
            padding: 16,
          })
        }
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemContainerStyle={{
          backgroundColor: theme[current].white,
        }}
        data={data}
        activeColor={theme[current].orange}
        labelField="label"
        valueField="value"
        placeholder="Genre"
        value={selected}
        onChange={handleSelectionChange}
        renderLeftIcon={() => (
          <MaterialCommunityIcons name="filmstrip" size={24} color="black" />
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View
              style={[
                styles.selectedStyle,
                {
                  backgroundColor: theme[current].white,
                  borderColor: theme[current].orange,
                },
              ]}
            >
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="black" name="delete" size={17} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export const LanguageFilter = ({ setLanguage }) => {
  const { current } = useTheme();
  const data = languages.map((language, index) => ({
    label: language,
    value: index.toString(),
  }));
  const [selected, setSelected] = useState([]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const handleSelectionChange = (selectedItems) => {
    setSelected(selectedItems);

    const selectedLanguages = selectedItems.map(
      (item) => data.find((language) => language.value === item).label
    );

    setLanguage(selectedLanguages);
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        style={
          (styles.dropdown,
          {
            backgroundColor: theme[current].white,
            padding: 16,
          })
        }
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemContainerStyle={{
          backgroundColor: theme[current].white,
        }}
        data={data}
        activeColor={theme[current].orange}
        labelField="label"
        valueField="value"
        placeholder="Language"
        value={selected}
        onChange={handleSelectionChange}
        renderLeftIcon={() => (
          <FontAwesome name="language" size={24} color="black" />
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View
              style={[
                styles.selectedStyle,
                {
                  backgroundColor: theme[current].white,
                  borderColor: theme[current].orange,
                },
              ]}
            >
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="black" name="delete" size={17} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export const YearFilter = ({ setYear }) => {
  const { current } = useTheme();
  const data = years.map((year, index) => ({
    label: year,
    value: index.toString(),
  }));
  const [selected, setSelected] = useState([]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const handleSelectionChange = (selectedItems) => {
    setSelected(selectedItems);

    const selectedYears = selectedItems.map(
      (item) => data.find((year) => year.value === item).label
    );

    setYear(selectedYears);
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        style={
          (styles.dropdown,
          {
            backgroundColor: theme[current].white,
            padding: 16,
          })
        }
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemContainerStyle={{
          backgroundColor: theme[current].white,
        }}
        data={data}
        activeColor={theme[current].orange}
        labelField="label"
        valueField="value"
        placeholder="Year"
        value={selected}
        onChange={handleSelectionChange}
        renderLeftIcon={() => (
          <AntDesign name="calendar" size={24} color="black" />
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View
              style={[
                styles.selectedStyle,
                {
                  backgroundColor: theme[current].white,
                  borderColor: theme[current].orange,
                },
              ]}
            >
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="black" name="delete" size={17} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,

    borderRadius: 4,
    padding: 12,
    borderColor: "red",
  },
  placeholderStyle: {
    fontSize: 24,
    color: "gray",
    fontWeight: 400,
    marginLeft: 12,
  },
  selectedTextStyle: {
    fontSize: 18,
    color: "black",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "black",
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,

    shadowColor: "red",

    marginTop: 8,
    marginRight: 12,
    borderWidth: 4,

    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color: "black",
  },
});
