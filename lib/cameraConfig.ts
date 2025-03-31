export default function CameraConfiguration(itemType: string) {
    switch(itemType){
        case 'Switch':
            return {position: [-1,1.2,-1], zoom: 80};
        case 'Keyboard':
            return {position: [-1,1.2,-1], zoom: 10};

        default:
            return {position: [-1,1.2,-1], zoom: 20};

    }
}