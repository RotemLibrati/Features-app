import React, { useState } from "react";
import { Text, View, Button, ActivityIndicator, Alert, StyleSheet } from "react-native";
import Color from "../constants/Color";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapPreview from "./MapPreview";

const LocationPicker = props => {
    const [isFetching, setIsFetching] = useState(false);
    const [pickedLocation, setPickedLocation] = useState();
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== "granted") {
            Alert.alert("Insufficient permissions!", "You need to grant location permissions to use this app", [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };
    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        try {
            setIsFetching(true);
            const location = await Location.getCurrentPositionAsync({
                timeout: 5000
            });
            setPickedLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
        } catch (err) {
            Alert.alert('Could not fetch location', 'Please try again later of pick a location on the map',
                [{ text: 'Okay' }]
            );
        }
        setIsFetching(false);
    };
    return (
        <View style={styles.locationPicker}>
            <MapPreview style={styles.mapPreview} location={pickedLocation} >
                {isFetching ? (<ActivityIndicator size='large' color={Color.primary} />) : (<Text>No location chosen yet !</Text>)}
            </MapPreview>
            <Button title="Get User Location" color={Color.primary}
                onPress={getLocationHandler}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    locationPicker: {
        marginBottom: 15,

    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 150,
        borderColor: '#ccc',
        borderWidth: 1,

    }
});

export default LocationPicker;