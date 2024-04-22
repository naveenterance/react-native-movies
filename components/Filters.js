import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { genres } from "../utils/Genres";
import { languages } from "../utils/Languages";
import { years } from "../utils/Years";

export const GenreFilter = ({ setGenre }) => {
  const data = genres.map((genre, index) => ({
    label: genre,
    value: index.toString(),
  }));
  const [selected, setSelected] = useState([]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="white" name="Safety" size={20} />
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
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemContainerStyle={styles.itemContainerStyle}
        data={data}
        activeColor="#FF0000"
        labelField="label"
        valueField="value"
        placeholder="Select item"
        value={selected}
        onChange={handleSelectionChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="white"
            name="Safety"
            size={20}
          />
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="white" name="delete" size={17} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export const LanguageFilter = ({ setLanguage }) => {
  const data = languages.map((language, index) => ({
    label: language,
    value: index.toString(),
  }));
  const [selected, setSelected] = useState([]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="white" name="Safety" size={20} />
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
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemContainerStyle={styles.itemContainerStyle}
        data={data}
        activeColor="#FF0000"
        labelField="label"
        valueField="value"
        placeholder="Select item"
        value={selected}
        onChange={handleSelectionChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="white"
            name="Safety"
            size={20}
          />
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="white" name="delete" size={17} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export const YearFilter = ({ setYear }) => {
  const data = years.map((year, index) => ({
    label: year,
    value: index.toString(),
  }));
  const [selected, setSelected] = useState([]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="white" name="Safety" size={20} />
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
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemContainerStyle={styles.itemContainerStyle}
        data={data}
        activeColor="#FF0000"
        labelField="label"
        valueField="value"
        placeholder="Select item"
        value={selected}
        onChange={handleSelectionChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="white"
            name="Safety"
            size={20}
          />
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="white" name="delete" size={17} />
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
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "white",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "white",
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
    backgroundColor: "#222",
    shadowColor: "#000",
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
    color: "white",
  },
  itemContainerStyle: {
    backgroundColor: "black",
  },
});
