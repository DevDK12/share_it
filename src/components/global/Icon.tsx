import { FC } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';

type IconProps = {
    color?: string;
    size: number;
    name: string;
    iconFamily: "Ionicons" | "MaterialIcons" | "MaterialCommunityIcons";
};


const Icon: FC<IconProps> = ({ color, size, name, iconFamily }) => {
    return (
        <>
            {iconFamily === "Ionicons" && <Ionicons name={name} size={RFValue(size)} color={color} />}
            {iconFamily === "MaterialIcons" && <MaterialIcons name={name} size={RFValue(size)} color={color} />}
            {iconFamily === "MaterialCommunityIcons" && <MaterialCommunityIcons name={name} size={RFValue(size)} color={color} />}
        </>
    );
};
export default Icon;