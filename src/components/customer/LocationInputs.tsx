import { View, Text, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';

interface LocationInputProps extends TextInputProps {
    placeholder: string;
    type: 'pickup' | 'drop';
    value: string;
    onChangeText: (text: string) => void;
}

const LocationInputs: FC<LocationInputProps> = ({ placeholder, type, value, onChangeText, ...props }) => {
    const [isFocused, setIsFocused] = useState(false); 

    const dotColor = type === 'pickup' ? 'green' : 'red';

    return (
        <View
            style={[
                styles.container,
                styles.focusedContainer,
                {
                    backgroundColor: value === '' ? '#fff' : '#f2f2f2',
                    borderColor: isFocused ? '#4CAF50' : '#ccc', 
                },
            ]}
        >
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
            <TextInput
                style={[styles.input, { backgroundColor: value === '' ? '#fff' : '#f2f2f2' }]}
                placeholder={placeholder}
                placeholderTextColor={'#aaa'}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)} // Set focused state to true when the input is focused
                onBlur={() => setIsFocused(false)} // Set focused state to false when the input loses focus
                {...props}
            />
            {value !== "" && (
                <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearIcon}>
                    <Ionicons name="close-circle" size={RFValue(16)} color="#ccc" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        marginVertical: 7,
    },
    focusedContainer: {
        borderWidth: 1,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 4,
        marginRight: 10,
    },
    input: {
        height: 45,
        width: '90%',
        fontSize: 16,
        color: '#000',
    },
    clearIcon: {
        marginLeft: 10, 
    },
});

export default LocationInputs;
